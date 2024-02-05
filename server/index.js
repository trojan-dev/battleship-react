const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:5173', 'https://battleship-server-socket.onrender.com']
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
    socket.on('whose-turn', turn => {
        socket.broadcast.emit('chance', turn);
    })
})