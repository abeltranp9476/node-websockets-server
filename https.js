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
                origin: "*",
        },
};

const io = require("socket.io")(httpServer, options);

io.on("connection", socket => { /* ... */ });

httpServer.listen(3001);

