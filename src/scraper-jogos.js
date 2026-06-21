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

                            let lastParsedIdx = -1;

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

                                    // Data e hora agora ficam APÓS o time 2
                                    let dateIdx = team2Index + 1;
                                    let timeIdx = team2Index + 2;
                                    
                                    let dateStr = texts[dateIdx];
                                    let timeStr = '--:--';
                                    let matchEndIdx = dateIdx;

                                    const isTimeString = (s) => s && (/^\\d{2}:\\d{2}$/.test(s) || s === 'Data a definir');
                                    const isDateString = (s) => s && (s === 'Data a definir' || /^\\d{2}\\/\\d{2}$/.test(s) || /^[a-z]+$/i.test(s) || /^\\d{2} de [a-z]+$/i.test(s));
                                    
                                    if (isTimeString(texts[timeIdx])) {
                                        timeStr = texts[timeIdx];
                                        matchEndIdx = timeIdx;
                                    }
                                    
                                    if (!isDateString(dateStr)) {
                                        dateStr = 'A Definir';
                                    } else if (dateStr === 'Data a definir') {
                                        dateStr = 'A Definir';
                                    }

                                    if (timeStr === 'Data a definir') {
                                        timeStr = '--:--';
                                    }

                                    // Competição e Estádio ficam ANTES do time 1 (limitados pelo final do jogo anterior)
                                    let metadataStart = lastParsedIdx !== -1 ? lastParsedIdx + 1 : Math.max(0, team1Index - 3);
                                    let metadataStrings = [];
                                    
                                    for (let j = metadataStart; j < team1Index; j++) {
                                        let s = texts[j];
                                        if (s && s !== 'Cruzeiro Esporte Clube' && !s.includes('JavaScript')) {
                                            metadataStrings.push(s);
                                        }
                                    }
                                    
                                    let competition = metadataStrings.join(' - ') || 'Campeonato';

                                    lastParsedIdx = matchEndIdx;

                                    if (isFutureMatch && (team1 === 'CRU' || team2 === 'CRU')) {
                                        let homeTeam = team1 === 'CRU' ? 'Cruzeiro' : (teamMap[team1] || team1);
                                        let awayTeam = team2 === 'CRU' ? 'Cruzeiro' : (teamMap[team2] || team2);

                                        results.push({
                                            homeTeam,
                                            awayTeam,
                                            date: dateStr,
                                            time: timeStr,
                                            competition: competition
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
