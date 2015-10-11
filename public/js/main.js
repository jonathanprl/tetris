var url = window.location.href,
    socket = io.connect(url.replace(/\/$/, "")),
    id;

var Ballr = function () {
    this.url = window.location.href;
    this.socket = io.connect(url.replace(/\/$/, ""));

    var canvas = document.getElementById("canvas"),
    this.ctx = canvas.getContext("2d");
};

var BallrUser = function () {
    this.id = Ballr.socket.on('id', function(data) {
        console.log("id");
        return data.id;
    });
};

function init() {

    

    canvas.width = canvas.height = 500;

    var uid = id,
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
};
