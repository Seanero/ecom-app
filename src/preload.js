const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Fermeture de l'application
    closeApp: () => ipcRenderer.send('close-app'),

    // Gestion de l'authentification
    login: (email, password) => ipcRenderer.invoke('login', { email, password }),
    getUserInfo: () => ipcRenderer.invoke('get-user-info'),
    logout: () => ipcRenderer.invoke('logout')
});