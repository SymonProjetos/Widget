const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { getNextMatches } = require('./scraper-jogos');
const { getTicketsStatus } = require('./scraper-ingressos');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 350,
        height: 650,
        transparent: true,
        frame: false,
        resizable: false,
        skipTaskbar: true,
        type: 'desktop',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));


    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    mainWindow.setPosition(width - 380, 50);


    mainWindow.webContents.on('did-finish-load', () => {
        fetchAndSendMatches();
    });
}

async function fetchAndSendMatches() {
    const [matches, tickets] = await Promise.all([
        getNextMatches(5),
        getTicketsStatus()
    ]);
    if (mainWindow) {
        mainWindow.webContents.send('update-matches', matches);
        mainWindow.webContents.send('update-tickets', tickets);
    }
}

app.whenReady().then(() => {
    createWindow();


    if (app.isPackaged) {
        app.setLoginItemSettings({
            openAtLogin: true,
            path: app.getPath("exe"),
        });
    }


    setInterval(fetchAndSendMatches, 6 * 60 * 60 * 1000);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
