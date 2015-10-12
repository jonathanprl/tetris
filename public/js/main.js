var BallrApp = function () {

    // Connect to the server via socket
    var url = window.location.href;
    this.socket = io.connect(url.replace(/\/$/, ""));

    // Find the canvas and get context
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    // Let server know we are ready!
    this.socket.emit('ready', true);

    // Generate a colour (TODO: limit boring colours)
    this.generateColour();

    // Set initial coordinates (TODO: Add this to the settings file)
    this.coords = {
        x: 10,
        y: 10
    };

    return this;
};

// Set user id.
BallrApp.prototype.setUuid = function(uuid) {
    this.uuid = uuid;
};

// Generate users colour
BallrApp.prototype.generateColour = function() {
    var colour = [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255)
    ];

    this.colour = "rgb(" + colour.join(',') + ")";
};

// Get colour
BallrApp.prototype.generateColour = function() {
    return this.colour;
};

BallrApp.prototype.updateServer = function() {
    this.socket.emit('upload', {
        uuid: this.uuid,
        x: this.coords.x,
        y: this.coords.y,
        colour: this.colour
    });
};

BallrApp.prototype.updateCoordinates = function(x, y) {
    this.coords = {
        x: x,
        y: y
    };
};

BallrApp.prototype.start = function() {

    this.canvas.width = this.canvas.height = 1000;

    this.targetX = 0,
        this.targetY = 0,
        this.velX = 0,
        this.velY = 0,
        this.speed = 2;

    this.canvas.addEventListener("mousemove", function(e) {
        ballr.targetX = e.pageX;
        ballr.targetY = e.pageY;
    });

    this.update();

    this.socket.on('download', function(data) {
        if (data.uuid != ballr.uuid) {
            var ctx = ballr.canvas.getContext("2d");

            ballr.ctx.fillStyle = data.colour;
            // ballr.ctx.clearRect(0,0,500,500);
            ballr.ctx.beginPath();
            ballr.ctx.arc(data.x, data.y, 5, 0, Math.PI*2);
            ballr.ctx.fill();
        }
    });
};

BallrApp.prototype.update = function() {
    var tx = this.targetX - this.coords.x,
    ty = this.targetY - this.coords.y,
    dist = Math.sqrt(tx * tx + ty * ty),
    rad = Math.atan2(ty, tx),
    angle = rad / Math.PI * 180;

    this.velX = (tx / dist) * this.speed,
    this.velY = (ty / dist) * this.speed;

    this.coords.x += this.velX;
    this.coords.y += this.velY;

    this.ctx.fillStyle = this.colour;
    // this.ctx.clearRect(0,0,500,500);
    this.ctx.beginPath();
    this.ctx.arc(ballr.coords.x, ballr.coords.y, 5, 0, Math.PI*2);
    this.ctx.fill();

    this.updateServer();

    function updateAgain() {
        ballr.update();
    }

    setTimeout(updateAgain, 10);
};

// App Initiation

var ballr = new BallrApp();

// Get unique id from server

ballr.socket.on('id', function(data) {
    ballr.setUuid(data);
});