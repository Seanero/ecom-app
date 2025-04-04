const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})

contextBridge.exposeInMainWorld('electronAPI', {
    closeApp: () => ipcRenderer.send('close-app'),
    // Envoyer les identifiants au processus principal
    login: (email, password) => ipcRenderer.invoke('login', { email, password }),

    // Recevoir le résultat de la connexion
    onLoginResult: (callback) => ipcRenderer.on('login-result', (event, result) => callback(result))
});