const io = require('socket.io')(3000, {
    cors: {
        origin: "*"
    }
});
const firstPlayerGoesFirst = true;
io.on('connection', async (socket) => {
    io.emit("player_joined", socket.id);
    socket.on('player-ready', (shipsPlacement, coordinates, playerReady) => {
        socket.broadcast.emit('receive-opponent-status', { shipsPlacement, coordinates, playerReady });
    })
    socket.on('player-disconnect', playerId => {
        socket.broadcast.emit('disconnect', playerId)
    })
    socket.on('fire-missile', (cell, strike, opponentShips) => {
        socket.broadcast.emit('send-cell-info', { cell, strike, opponentShips });
    })
})