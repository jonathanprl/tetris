var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

server.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Ballr server started [http://%s:%s]', host, port);
});

io.on('connection', function (socket) {
    console.log(socket.id + ' has joined.');
    socket.on('upload', function (data) {
        io.emit('download', data);
    });  
});

// TODO: MongoDB to hold data for each "match", so new players see paths and replays can be created.