window.electronAPI.onUpdateMatches((event, matches) => {
    if (typeof notifyUpdateFinished === 'function') notifyUpdateFinished();
    const container = document.getElementById('matches-container');
    container.innerHTML = '';

    if (!matches || matches.length === 0) {
        container.innerHTML = '<div class="error">Não foi possível carregar os jogos.</div>';
        return;
    }

    matches.forEach(match => {
        const isHome = match.homeTeam.toLowerCase().includes('cruzeiro');
        const opponent = isHome ? match.awayTeam : match.homeTeam;
        const locationBadge = isHome ? '<span class="badge badge-home">CASA</span>' : '<span class="badge badge-away">FORA</span>';

        const dateDisplay = match.date === 'A Definir' ? 'A Definir' : `${match.date} • ${match.time}`;

        const card = document.createElement('div');
        card.className = 'match-card';
        card.innerHTML = `
            <div class="match-header">
                <span class="competition">${match.competition}</span>
                ${locationBadge}
            </div>
            <div class="match-teams">
                <div class="team">
                    <span class="team-name ${isHome ? 'cruzeiro' : ''}">${match.homeTeam}</span>
                </div>
                <div class="vs">X</div>
                <div class="team">
                    <span class="team-name ${!isHome ? 'cruzeiro' : ''}">${match.awayTeam}</span>
                </div>
            </div>
            <div class="match-footer">
                <div class="datetime-display">
                    <span class="icon">🗓</span> ${dateDisplay}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
});
