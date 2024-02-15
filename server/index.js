const io = require('socket.io')(3000, {
    cors: {
        origin: "*"
    }
});
const firstPlayerGoesFirst = true;
io.on('connection', async (socket) => {
    io.emit("player_joined", socket.id);
    const connectedUsers = await io.fetchSockets();
    if (connectedUsers.length === 1) {
        socket.broadcast.emit('player_chance', firstPlayerGoesFirst)
    }
    if (connectedUsers.length === 2) {
        socket.broadcast.emit('opponent_chance', !firstPlayerGoesFirst)
    }
    socket.on('player-ready', (shipsPlacement, coordinates) => {
        socket.broadcast.emit('receive-opponent-status', { shipsPlacement, coordinates });
    })
    socket.on('player-disconnect', playerId => {
        socket.broadcast.emit('disconnect', playerId)
    })
    socket.on('fire-missile', (cell, strike, opponentShips) => {
        socket.broadcast.emit('send-cell-info', { cell, strike, opponentShips });
    })
})