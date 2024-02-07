const io = require('socket.io')(3000, {
    cors: {
        origin: "*"
    }
});
io.on('connection', socket => {
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