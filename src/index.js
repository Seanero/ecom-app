const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
const path = require('path');
const api = require('./utils/api/api');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

// Création d'un cookie jar pour stocker et gérer les cookies
const jar = new CookieJar();

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

  // Configuration d'axios avec le cookie jar
  const apiClient = wrapper(axios.create({
    baseURL: 'http://fr0-games-001.palmasys.fr:25637',
    withCredentials: true,
    jar
  }));

  // API de connexion
  ipcMain.handle('login', async (event, credentials) => {
    try {
      // Première requête: login
      const loginResponse = await apiClient.post('/users/login', {
        email: credentials.email,
        password: credentials.password
      });

      // Afficher les cookies pour le débogage
      console.log('Cookies après login:', jar.getCookiesSync('http://fr0-games-001.palmasys.fr:25637'));

      // Vérifie si le login a réussi
      if (loginResponse.data.code === 'LOGIN-SUCCESS') {
        // Seconde requête: récupération des données utilisateur
        const userInfoResponse = await apiClient.get('/users/me');
        console.log('Réponse de /users/me:', userInfoResponse.data);

        const userData = userInfoResponse.data;

        return {
          success: true,
          userData
        };
      } else {
        return {
          success: false,
          error: 'Code de réponse inattendu'
        };
      }
    } catch (error) {
      console.error('Erreur de login:', error.message);
      if (error.response) {
        console.error('Détails de l\'erreur:', error.response.status, error.response.data);
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Identifiants incorrects'
      };
    }
  });

  // API pour récupérer les informations utilisateur
  ipcMain.handle('get-user-info', async () => {
    try {
      const response = await apiClient.get('/users/me');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur get-user-info:', error.message);
      return { success: false, error: 'Erreur lors de la récupération des données utilisateur' };
    }
  });

  // API de déconnexion
  ipcMain.handle('logout', async () => {
    try {
      await apiClient.get('/users/logout');
      // Vider le cookie jar après déconnexion
      jar.removeAllCookiesSync();
      return { success: true };
    } catch (error) {
      console.error('Erreur logout:', error.message);
      return { success: false };
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
  app.quit();
});