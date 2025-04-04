const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('src/views/index.html');
}

app.whenReady().then(() => {
  createWindow();

  // Gestionnaire de requête de connexion
  ipcMain.handle('login', async (event, credentials) => {
    try {
      const response = await axios.post('http://fr0-games-001.palmasys.fr:25637/users/login', {
        email: credentials.email,
        password: credentials.password
      });

      // Envoyer le résultat au processus de rendu
      event.sender.send('login-result', {
        success: true,
        data: response.data
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur de connexion:', error.message);

      // Envoyer l'erreur au processus de rendu
      event.sender.send('login-result', {
        success: false,
        error: error.message || 'Erreur de connexion'
      });

      return { success: false, error: error.message };
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('close-app', () => {
  app.quit()
})
