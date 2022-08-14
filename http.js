var fs = require('fs');
var express = require("express");
const cors = require('cors');
var body_parser = require('body-parser');
const {channel} = require('diagnostics_channel');
var app = express();
app.use(body_parser.urlencoded({extended: true}));
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

app.get('/send', function (req, res) {
    let token = req.query.token;
    let content = req.query.content;
    let channel = req.query.channel;
    let event = req.query.event;
    let secret_token = 'asdasd';

    if (secret_token === token && content !== '') {
        io.to(channel).emit(event, content);
        res.send('Notificacion enviada');
    } else {
        res.send('No autorizado');
    }
});

var count_channels = {};
var sockets = {};

app.get('/clients', function (req, res) {
    res.send('[{"total": ' + count_channels[req.query.channel] + '}]');
});


io.on("connection", function (socket) {

    socket.on('join', (channel) => {
        socket.join(channel);
        sockets[socket.id] = socket.rooms;
        socket.emit('log', 'Se ha unido a la sala: ' + channel);
        if (typeof count_channels[channel] === "undefined") {
            count_channels[channel] = 0;
        }
        count_channels[channel]++;
    });

    socket.on("disconnect", (reason) => {
        if (typeof sockets[socket.id] !== "undefined") {
            let channels = sockets[socket.id];

            for (let channel of channels) {
                count_channels[channel]--;
            }

            delete sockets[socket.id];
        }
    });

});


http.listen(3001, function () {
    console.log("Servidor corriendo en http://localhost:3001");
});
