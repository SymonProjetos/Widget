const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const { getNextMatches } = require('./scraper-jogos');
const { getTicketsStatus } = require('./scraper-ingressos');

if (!app.isPackaged) {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron')
    });
}

let mainWindow;
let lastTicketStatus = false;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 350,
        height: 870,
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
        fetchAndSendTickets();
    });
}

async function fetchAndSendMatches() {
    const matches = await getNextMatches(10);
    if (mainWindow) {
        mainWindow.webContents.send('update-matches', matches);
    }
}

async function fetchAndSendTickets() {
    const tickets = await getTicketsStatus();
    if (mainWindow) {
        mainWindow.webContents.send('update-tickets', tickets);
    }

    if (tickets && tickets.available && !lastTicketStatus) {
        new Notification({
            title: 'Ingressos Disponíveis!',
            body: 'Há ingressos disponíveis para o Cruzeiro.'
        }).show();
    }
    if (tickets && !tickets.error) {
        lastTicketStatus = tickets.available;
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
    setInterval(fetchAndSendTickets, 1 * 60 * 60 * 1000);

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
