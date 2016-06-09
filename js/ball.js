
var COLOR_IDX = 0;

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

var COLORS = ["Black"];

function Ball(game, x, y, radius, mass, color, velocity) {
    this.game = game;
    this.radius = (typeof radius !== 'undefined') ? radius : Math.floor(Math.random() * (25 - 6)) + 5; // between 5 and 25
    this.mass = (typeof mass !== 'undefined') ? mass : this.radius * this.radius * Math.PI; // mass being proportional to area of circle
    if (COLOR_IDX <= 15) {
        this.colorIdx = COLOR_IDX++;
    } else {
        COLOR_IDX = 0;
        this.colorIdx = COLOR_IDX++;
    }
    this.color = (typeof color !== 'undefined') ? color : COLORS[this.colorIdx];
    this.x = (typeof x !== 'undefined') ? x : this.radius + Math.random() * (800 - this.radius * 2);
    this.y = (typeof y !== 'undefined') ? y : this.radius + Math.random() * (400 - this.radius * 2);

    Entity.call(this, this.game, this.x, this.y);

    if (typeof velocity !== 'undefined') {
        this.velocity = velocity;
    } else {
        this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
        if (Math.random() > 0.5) this.velocity.x = -this.velocity.x;
        if (Math.random() > 0.5) this.velocity.y = -this.velocity.y;
    }

    this.momentum = { x: this.mass * this.velocity.x, y: this.mass * this.velocity.y };
}

Ball.prototype = new Entity();
Ball.prototype.constructor = Ball;



Ball.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Ball.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Ball.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Ball.prototype.collideBottom = function () {
    return (this.y + this.radius) > 400;
};

Ball.prototype.update = function () {
    Entity.prototype.update.call(this);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 400 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
    }
};

Ball.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
};
