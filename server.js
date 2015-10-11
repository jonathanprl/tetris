var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

server.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

io.on('connection', function (socket) {
    socket.on('upload', function (data) {
        io.emit('download', data);
        console.log(data);
    });  
});