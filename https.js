const fs = require("fs");
var body_parser = require('body-parser');
var express = require("express");
var app = express();
app.use(body_parser.urlencoded({extended: true}));

const httpServer = require("https").createServer({
    key: fs.readFileSync("/etc/letsencrypt/live/testing.medislove.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/testing.medislove.com/fullchain.pem")
}, app);

app.get('/send', function (req, res) {
    let token = req.query.token;
    let content = req.query.content;
    let channel = req.query.channel;
    let secret_token = 'asdasd';

    if (secret_token === token && content !== '') {
        io.emit(channel, content);
        res.send('Notificacion enviada');
    } else {
        res.send('No autorizado');
    }
});

const options = {
    cors: {
        origin: "*"
    }
};

const io = require("socket.io")(httpServer, options);

var count_channels = {};
var sockets = {};

app.get('/clients', function (req, res) {
    res.send('[{"total": ' + count_channels[req.query.channel] + '}]');
});


io.on("connection", function (socket) {

    socket.on('join', (channel) => {
        socket.join(channel);
        sockets[socket.id] = channel;
        socket.emit('log', 'Se ha unido a la sala: ' + channel);
        if (typeof count_channels[channel] === "undefined") {
            count_channels[channel] = 0;
        }
        count_channels[channel]++;
    });

    socket.on("disconnect", (reason) => {
        if (typeof sockets[socket.id] !== "undefined") {
            let channel = sockets[socket.id];
            count_channels[channel]--;
            delete sockets[socket.id];
        }
    });

});

httpServer.listen(3001, function () {
    console.log("Servidor corriendo en http://localhost:3001");
});
