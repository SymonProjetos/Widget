const { BrowserWindow } = require('electron');

function getNextMatches(count = 10) {
    return new Promise((resolve) => {
        let win = new BrowserWindow({
            show: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true
            }
        });

        win.loadURL('https://www.cruzeiro.com.br/categoria/masculino?tab=jogos');

        let timeout;
        win.webContents.on('did-finish-load', () => {
            clearTimeout(timeout);
            timeout = setTimeout(async () => {
                if (win.isDestroyed()) return;
                try {
                    const matches = await win.webContents.executeJavaScript(`
                        (() => {
                            const texts = Array.from(document.querySelectorAll('*'))
                                .filter(el => el.children.length === 0 && el.textContent.trim() !== '')
                                .map(el => el.textContent.trim());
                            
                            const results = [];
                            
                            const teamMap = {
                                'INT': 'Internacional', 'BOT': 'Botafogo', 'CTB': 'Coritiba', 'CHA': 'Chapecoense',
                                'MIR': 'Mirassol', 'FLA': 'Flamengo', 'VAS': 'Vasco', 'CAP': 'Athletico-PR',
                                'SAN': 'Santos', 'VIT': 'Vitória', 'SAO': 'São Paulo', 'RBB': 'Bragantino',
                                'GRE': 'Grêmio', 'REM': 'Remo', 'ATL': 'Atlético-MG', 'BAH': 'Bahia',
                                'PAL': 'Palmeiras', 'FLU': 'Fluminense', 'COR': 'Corinthians', 'GOI': 'Goiás',
                                'CUI': 'Cuiabá', 'JUV': 'Juventude', 'CRI': 'Criciúma', 'FOR': 'Fortaleza',
                                'AGO': 'Atlético-GO', 'BOC': 'Boca Juniors', 'CAT': 'U. Católica'
                            };

                            for (let i = 0; i < texts.length; i++) {
                                if (texts[i] === ':') {
                                    let team1Index = i - 1;
                                    let team2Index = i + 1;
                                    let isFutureMatch = true;

                                    if (!isNaN(parseInt(texts[team1Index]))) {
                                        team1Index--;
                                        isFutureMatch = false; 
                                    }
                                    if (!isNaN(parseInt(texts[team2Index]))) {
                                        team2Index++;
                                        isFutureMatch = false; 
                                    }

                                    let team1 = texts[team1Index];
                                    let team2 = texts[team2Index];

                                    if (isFutureMatch && (team1 === 'CRU' || team2 === 'CRU')) {
                                        let dateStr = 'A Definir';
                                        let timeStr = '--:--';
                                        let competition = 'Campeonato';

                                        let t10 = texts[team1Index - 10];
                                        let t9 = texts[team1Index - 9];
                                        let t8 = texts[team1Index - 8];
                                        let t7 = texts[team1Index - 7];
                                        let t6 = texts[team1Index - 6];
                                        let t5 = texts[team1Index - 5];
                                        let t4 = texts[team1Index - 4];
                                        let t3 = texts[team1Index - 3];
                                        let t2 = texts[team1Index - 2];
                                        let t1 = texts[team1Index - 1];

                                        const isDate = (s) => s && (s === 'Data a definir' || /^\\d{2}\\/\\d{2}$/.test(s));
                                        const isTime = (s) => s && (s === 'Data a definir' || /^\\d{2}:\\d{2}$/.test(s));

                                        if (isDate(t5) && isTime(t4)) {
                                            dateStr = t5;
                                            timeStr = t4;
                                            competition = t3 + (t1 ? ' - ' + t1 : '');
                                        } else if (isDate(t4) && isTime(t3)) {
                                            dateStr = t4;
                                            timeStr = t3;
                                            competition = t2;
                                        } else if (t4 === 'Data a definir') {
                                            dateStr = t4;
                                            competition = t3 + (t1 ? ' - ' + t1 : '');
                                        } else if (t3 === 'Data a definir') {
                                            dateStr = t3;
                                            competition = t2;
                                        }

                                        if (dateStr === 'Data a definir') dateStr = 'A Definir';
                                        if (timeStr === 'Data a definir') timeStr = '--:--';

                                        let homeTeam = team1 === 'CRU' ? 'Cruzeiro' : (teamMap[team1] || team1);
                                        let awayTeam = team2 === 'CRU' ? 'Cruzeiro' : (teamMap[team2] || team2);

                                        results.push({
                                            homeTeam,
                                            awayTeam,
                                            date: dateStr,
                                            time: timeStr,
                                            competition: competition || 'Campeonato'
                                        });
                                    }
                                }
                            }
                            return results;
                        })();
                    `);

                    if (!win.isDestroyed()) win.destroy();
                    resolve(matches.slice(0, count));
                } catch (error) {
                    console.error('Erro ao ler a página do Cruzeiro:', error);
                    if (!win.isDestroyed()) win.destroy();
                    resolve([]);
                }
            }, 8000);
        });
    });
}

module.exports = { getNextMatches };
