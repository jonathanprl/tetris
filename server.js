var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tetris');

app.use(express.static('public'));

server.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Tetris server started [http://%s:%s]', host, port);
});

io.on('connection', function (socket) {
    console.log("%s has connected.", socket.id);

    socket.on('upload', function (data) {
        io.emit('download', data);
    });

    socket.on('ready', function (data) {
        console.log("ready");
        socket.emit('id', socket.id);
    });
});

io.on('download', function (data) {
    console.log('Sending to client: %s', data);
});

// TODO: MongoDB to hold data for each "match", so new players see paths and replays can be created.