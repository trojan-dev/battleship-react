const io = require('socket.io')(3000, {
    cors: {
        origin: "*"
    }
});
io.on('connection', socket => {
    socket.on('player-ready', (playerName, shipsPlacement, coordinates, id) => {
        console.log(`${playerName} has started`)
        socket.broadcast.emit('receive-opponent-status', { playerName, shipsPlacement, coordinates });
    })
    socket.on('fire-missile', cell => {
        console.log(cell);
        socket.broadcast.emit('send-cell-info', cell);
    })
    socket.on('turn-change', userId => {
        io.emit('chance', userId);
    })
})