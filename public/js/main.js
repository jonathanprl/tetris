var BallrApp = function () {

    // Connect to the server via socket
    var url = window.location.href;
    this.socket = io.connect(url.replace(/\/$/, ""));

    // Find the canvas and get context
    this.canvas = document.getElementById("canvas");
    this.ctx = {};

    // Let server know we are ready!
    this.socket.emit('ready', true);

    // Generate a colour (TODO: limit boring colours)
    this.generateColour();

    // Set initial coordinates (TODO: Add this to the settings file)
    this.coords = {
        x: 10,
        y: 10
    };

    // Get unique id from server

    this.socket.on('id', function(data) {
        ballr.setUuid(data);
        ballr.addPlayerContext(data);
    });

    return this;
};

// Set user id.
BallrApp.prototype.setUuid = function(uuid) {
    console.log("You are %s", uuid);
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

BallrApp.prototype.updateServer = function() {
    this.socket.emit('upload', {
        uuid: this.uuid,
        coords: {    
            x: this.coords.x,
            y: this.coords.y
        },
        colour: this.colour
    });
};

BallrApp.prototype.updateCoordinates = function(x, y) {
    this.coords = {
        x: x,
        y: y
    };
};

BallrApp.prototype.addPlayerContext = function(uuid) {
    console.log("Added player %s", uuid);
    this.ctx[uuid] = this.canvas.getContext("2d");
};

BallrApp.prototype.updatePlayerContext = function(data) {
    // console.log("Updating player %s", data.uuid);

    this.ctx[data.uuid] = this.canvas.getContext("2d");
    this.ctx[data.uuid].fillStyle = data.colour;
    // this.ctx[data.uuid].clearRect(0,0,500,500); // just circles flying around
    this.ctx[data.uuid].beginPath();
    this.ctx[data.uuid].arc(data.coords.x, data.coords.y, 5, 0, Math.PI*2);
    this.ctx[data.uuid].fill();
};

BallrApp.prototype.start = function() {

    document.getElementById('ready').style.display = 'none';

    this.canvas.width = this.canvas.height = 1000;

    this.targetX = 0,
    this.targetY = 0,
    this.velX = 2,
    this.velY = 2,
    this.speed = 2;

    this.canvas.addEventListener("mousemove", function(e) {
        ballr.targetX = e.pageX - 10;
        ballr.targetY = e.pageY - 10;
    });

    this.update();

    this.socket.on('download', function(data) {
        if (data.uuid in ballr.ctx) {
            ballr.updatePlayerContext(data);
        } else {
            ballr.addPlayerContext(data.uuid);
        }
    });
};

BallrApp.prototype.update = function() {

    // Calculate position, speed and turn angle
    // targetX = Current cursor position
    // coords.x = Current head position
    // dist = distance between coordinates (targetX, targetY) and (coords.x, coords.y)

    var deltaX = this.targetX - this.coords.x,
    deltaY = this.targetY - this.coords.y;

    var dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
    rad = Math.atan2(deltaY +10, deltaX+10),
    angle = rad / Math.PI * 180;

    // console.log("Cursor coords: (%s, %s)", this.targetX, this.targetY);
    // console.log("Head coords: (%s, %s)", this.coords.x, this.coords.y);
    // console.log("Head -> Cursor Distance: %s", dist);        

    // console.log("Velocity: (%s, %s)", this.velX, this.velY);

    this.velX = (deltaX / dist) * this.speed,
    this.velY = (deltaY / dist) * this.speed;

    this.coords.x += this.velX;
    this.coords.y += this.velY;

    this.updateServer();

    // Workaround due to inability to use prototype function in setTimeout.
    function updateAgain() {
        ballr.update();
    }

    setTimeout(updateAgain, 20);
};

// App Initiation

var ballr = new BallrApp();

// Get unique id from server

ballr.socket.on('id', function(data) {
    ballr.setUuid(data);
});