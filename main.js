const { app, BrowserWindow, Menu, ipcMain, Tray, nativeImage } = require('electron');
const path = require('path');

// Keep a global reference of the window object
let mainWindow;
let tray;
let activeTimer = { state: 'idle', remaining: 0, total: 0 };

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'), // Optional: add an icon
    show: false // Don't show until ready
  });

  // Load the index.html file
  mainWindow.loadFile('index.html');

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  // Set up IPC handlers
  setupIpcHandlers();

  // On macOS, re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Set up IPC handlers for secure communication
function setupIpcHandlers() {
  // Handle get-version requests
  ipcMain.handle('get-version', () => {
    return app.getVersion();
  });

  // Handle close-app requests
  ipcMain.handle('close-app', () => {
    app.quit();
  });

  // Handle send-message requests
  ipcMain.handle('send-message', (event, message) => {
    console.log('Received message from renderer:', message);
    return `Echo: ${message}`;
  });

  // Timer updates from renderer
  ipcMain.handle('timer-tick', (_e, payload) => {
    activeTimer = { ...activeTimer, ...payload };
    updateTray();
  });
  ipcMain.handle('timer-done', () => {
    activeTimer.state = 'finished';
    updateTray();
  });
  ipcMain.handle('timer-canceled', () => {
    activeTimer = { state: 'idle', remaining: 0, total: 0 };
    updateTray();
  });
}

// Security: Prevent navigation to external websites
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== 'null') {
      event.preventDefault();
    }
  });
});

// Tray setup and helpers
app.whenReady().then(() => {
  setupTray();
});

function setupTray() {
  if (tray) return;
  const iconPath = path.join(__dirname, 'assets', process.platform === 'darwin' ? 'trayTemplate.png' : 'tray.png');
  let icon = null;
  try {
    icon = nativeImage.createFromPath(iconPath);
  } catch (e) { /* ignore if missing; we'll use empty */ }
  tray = new Tray(icon || nativeImage.createEmpty());
  tray.setToolTip('BetterClock');
  tray.on('click', () => {
    // toggle pause/resume
    if (mainWindow) {
      mainWindow.webContents.send('tray-action', 'toggle');
      mainWindow.show();
    }
  });
  updateTray();
}

function formatMmSs(ms) {
  const secs = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function updateTray() {
  if (!tray) return;
  const isActive = activeTimer.state === 'running' || activeTimer.state === 'paused';
  const label = isActive ? ` ${formatMmSs(activeTimer.remaining)}` : '';
  tray.setTitle(label); // macOS supports title text in menu bar

  const context = Menu.buildFromTemplate([
    { label: 'Show Window', click: () => { if (mainWindow) { mainWindow.show(); mainWindow.focus(); } } },
    { type: 'separator' },
    { label: (activeTimer.state === 'running' ? 'Pause' : 'Resume'), enabled: isActive, click: () => { if (mainWindow) mainWindow.webContents.send('tray-action', 'toggle'); } },
    { label: 'Start', enabled: activeTimer.state === 'idle' || activeTimer.state === 'finished', click: () => { if (mainWindow) mainWindow.webContents.send('tray-action', 'start'); } },
    { label: 'Cancel', enabled: isActive, click: () => { if (mainWindow) mainWindow.webContents.send('tray-action', 'cancel'); } },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setContextMenu(context);
}