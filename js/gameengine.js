// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

var ADD_NEW_BALL_INTERVAL = 2; 
var MAX_BALL_COUNT = 16;

function GameEngine() {
    this.entities = [];
    this.balls = [];
    this.ctx = null;
    this.click = null;
    this.wheel = null;
    this.newBallTimeBucket = 0;
    
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.timer = new Timer();
};

GameEngine.prototype.start = function () {
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
};


GameEngine.prototype.addEntity = function (entity) {
    if (entity instanceof Ball) {
        this.balls.push(entity);
    }
    this.entities.push(entity);
};

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
};

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    var idx;
    for (idx = 0; idx < entitiesCount; idx++) {
        var entity = this.entities[idx];

        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    for (idx = this.entities.length - 1; idx >= 0; --idx) {
        var ent = this.entities[idx];
        if (ent.removeFromWorld) {
            this.entities.splice(idx, 1);
            }
            for (var ball = 0; ball < this.balls.length; ball++) {
                if (ent === this.balls[ball]) {
                    this.balls.splice(ball, 1);
                    break;
            }
        }
    }
};

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.timedAddingOfNewBalls();
    this.update();
    this.draw();
    this.click = null;
    this.wheel = null;
};

GameEngine.prototype.timedAddingOfNewBalls = function () {
    if (this.balls.length < MAX_BALL_COUNT) this.newBallTimeBucket += this.clockTick;
    if (this.newBallTimeBucket > ADD_NEW_BALL_INTERVAL && this.balls.length < MAX_BALL_COUNT) {
        this.newBallTimeBucket = 0;
        var validBall = this.ballPlacementCheckForCollisions();
        if (validBall.safeToAdd) this.addEntity(validBall);
    }
};

GameEngine.prototype.ballPlacementCheckForCollisions = function () {
    do {
        var ball = new Ball(this);
        ball.safeToAdd = true;
    } while (!ball.safeToAdd);
    return ball;
};



