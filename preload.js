const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,

  // Send an HTTP request via the main process (bypasses CORS entirely)
  sendRequest: (config) => ipcRenderer.invoke('send-request', config)
});
