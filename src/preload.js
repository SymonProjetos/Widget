const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateMatches: (callback) => ipcRenderer.on('update-matches', callback),
    onUpdateTickets: (callback) => ipcRenderer.on('update-tickets', callback),
    openExternal: (url) => shell.openExternal(url)
});
