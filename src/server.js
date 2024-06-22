'use strict'

// import { Server } from 'socket.io'

const { Server } = require('socket.io')

const clientUrl = 'http://localhost:3000'
const clientUrl2 = 'https://proyecto-pi-lost-temple.vercel.app/'
const clientUrl3 = 'https://proyecto-pi-lost-temple-git-juanc-jacklazers-projects.vercel.app/'

const port = 5000

const io = new Server({
    cors: {
        origin: [clientUrl, clientUrl2, clientUrl3] // clientUrl
    },
});

let players = [];

let valuesTransformPlayerForEnemy;

io.listen(port);

io.on('connection', (socket) => {
    console.log(
        'Player joined with ID',
        socket.id, '. There are ' +
        io.engine.clientsCount +
        ' player connected.'
    );

    socket.on('player-connected', () => {
        players.push({
            id: socket.id,
            urlAvatar: "",
            urlAvatar: io.engine.clientsCount === 1 ?
                '/assets/models/hero/HeroAAA.glb':
                '/assets/models/hero/HeroAAA.glb',
            //     // '/assets/models/rockenemy/RockEnemy.glb',
            position: null,
            rotation: null,
            animation: "Idle",
        });
        socket.emit('players-connected', players)
    });

    socket.on('moving-player', (valuesTransformPlayer) => {
        const player = players.find(player => player.id === socket.id);
        player.position = valuesTransformPlayer.position;
        player.rotation = valuesTransformPlayer.rotation;
        socket.broadcast.emit('update-values-transform-player', player);
        console.log(valuesTransformPlayer);
    });

    socket.on('disconect', () => {
        players = players.filter(player => player.id !== socket.id);
        console.log(
            'Player disconnected with ID',
            socket.id, ". There are "+
            ' players connected'
        );
        socket.emit('players-connected', players)
    });
})

// io.listen(port);
