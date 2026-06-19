const { BrowserWindow } = require('electron');

function getTicketsStatus() {
    return new Promise((resolve) => {
        let win = new BrowserWindow({
            show: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true
            }
        });

        win.loadURL('https://socio.cruzeiro.com.br/jogos');

        let timeout;
        win.webContents.on('did-finish-load', () => {
            clearTimeout(timeout);
            timeout = setTimeout(async () => {
                if (win.isDestroyed()) return;
                try {
                    const status = await win.webContents.executeJavaScript(`
                        (() => {
                            const emptyPage = document.querySelector('.empty-page');
                            if (emptyPage && emptyPage.textContent.includes('Nenhum jogo disponível')) {
                                return { available: false };
                            }
                            const jogos = document.querySelectorAll('.section-jogos');
                            if (jogos.length > 0 && jogos[0].textContent.trim() !== '') {
                                return { available: true };
                            }
                            return { available: false };
                        })();
                    `);

                    if (!win.isDestroyed()) win.destroy();
                    resolve(status);
                } catch (error) {
                    console.error('Erro ao ler a página de ingressos:', error);
                    if (!win.isDestroyed()) win.destroy();
                    resolve({ available: false, error: true });
                }
            }, 8000);
        });
    });
}

module.exports = { getTicketsStatus };
