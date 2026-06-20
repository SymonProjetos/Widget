window.electronAPI.onUpdateTickets((event, tickets) => {
    const container = document.getElementById('tickets-container');
    container.innerHTML = '';

    if (tickets && tickets.available) {
        container.innerHTML = `
            <div class="tickets-available" onclick="window.electronAPI.openExternal('https://socio.cruzeiro.com.br/jogos')">
                <div class="tickets-icon">🎫</div>
                <div class="tickets-text">
                    <strong>Ingressos Disponíveis!</strong>
                    <span>Clique para comprar</span>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="tickets-unavailable">
                <div class="tickets-icon">🎫</div>
                <div class="tickets-text">
                    <strong>Não disponíveis</strong>
                </div>
            </div>
        `;
    }
});
