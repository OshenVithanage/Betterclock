// Preload script for secure communication between renderer and main process
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message) => ipcRenderer.invoke('send-message', message),
  onMessage: (callback) => ipcRenderer.on('message-from-main', callback),
  getVersion: () => ipcRenderer.invoke('get-version'),
  closeApp: () => ipcRenderer.invoke('close-app'),

  // Timer/tray IPC
  timerTick: (payload) => ipcRenderer.invoke('timer-tick', payload),
  timerDone: () => ipcRenderer.invoke('timer-done'),
  timerCanceled: () => ipcRenderer.invoke('timer-canceled'),
  onTrayAction: (callback) => ipcRenderer.on('tray-action', callback)
});

// Log that preload script has loaded
console.log('Preload script loaded');