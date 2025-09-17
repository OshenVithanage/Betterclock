// Preload script for secure communication between renderer and main process
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example: Send message to main process
  sendMessage: (message) => ipcRenderer.invoke('send-message', message),
  
  // Example: Listen for messages from main process
  onMessage: (callback) => ipcRenderer.on('message-from-main', callback),
  
  // Example: Get app version
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // Example: Close the app
  closeApp: () => ipcRenderer.invoke('close-app')
});

// Log that preload script has loaded
console.log('Preload script loaded');