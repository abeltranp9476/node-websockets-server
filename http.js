var fs = require('fs');
var express = require("express");
const cors = require('cors');
var body_parser = require('body-parser');
var app = express();
app.use(body_parser.urlencoded({extended: true}));
var http = require('http').Server(app);
var io = require('socket.io')(http,  { cors: { origin: '*' } });

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

io.on("connection", function (socket) {
   //
});


http.listen(3001, function () {
    console.log("Servidor corriendo en http://localhost:3001");
});
