var socket = io.connect('http://swiftping.app:3000');

$(document).ready(function() {
    
    var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

    canvas.width = canvas.height = 500;

    var uid = guid()
        targetX = 0,
        targetY = 0,
        x = 10,
        y = 10,
        velX = 0,
        velY = 0,
        speed = 2,
        colour = randomRGB();

    function update() {
        var tx = targetX - x,
            ty = targetY - y,
            dist = Math.sqrt(tx * tx + ty * ty),
            rad = Math.atan2(ty, tx),
            angle = rad/Math.PI * 180;

            velX = (tx/dist)*speed,
            velY = (ty/dist)*speed;

            x += velX
            y += velY

            ctx.fillStyle = colour;
            // ctx.clearRect(0,0,500,500);
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI*2);
            ctx.fill();

            socket.emit('upload', {
                uid: uid,
                x: x,
                y: y,
                colour: colour
            });

        setTimeout(update, 10);
    }

    function draw() {

    }

    function randomRGB() {
        var colour = [
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255)
        ];

        return "rgb(" + colour.join(',') + ")";
    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

    update();

    canvas.addEventListener("mousemove", function(e){
        targetX = e.pageX;
        targetY = e.pageY;
    });

    socket.on('download', function(data) {
        console.log(data);
        if (data.uid != uid) {
            ctx.fillStyle = data.colour;
            // ctx.clearRect(0,0,500,500);
            ctx.beginPath();
            ctx.arc(data.x, data.y, 5, 0, Math.PI*2);
            ctx.fill();
        }
    });
});
