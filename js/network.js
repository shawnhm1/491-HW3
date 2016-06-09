/** ******************************************************** *
 *  NOTE THAT THE IO VAR IS IMPORTED FROM CODE ON THE SERVER
 *  ******************************************************** */
var SOCKET = io.connect("http://76.28.150.193:8888");

SOCKET.on("load", function (data) {
    debugger;
    console.log(data); 
    var balls = data.data.balls;
    for (var k = 0; k < GAME_ENGINE.entities.length; k++) {
        var ent = GAME_ENGINE.entities[k];
        if (ent instanceof Ball) ent.removeFromWorld = true;
    }
    GAME_ENGINE.balls = [];
    for (var j = 0; j < balls.length; j++) {
        var curr = balls[j];
        var b = new Ball(GAME_ENGINE, curr.x, curr.y, curr.radius, curr.mass, curr.color, curr.velocity);
        GAME_ENGINE.entities.push(b);
        GAME_ENGINE.balls.push(b);
    }
});

var GAME_DATA = {studentname: "Shawn Massoud", statename: "HW 3"};

var saveGameState = function () {
    GAME_DATA.data = {};
    GAME_DATA.data.balls = [];
    for (var i = 0, j = 0, k = 0, len = GAME_ENGINE.entities.length; i < len; i++) {
        var ent = GAME_ENGINE.entities[i];
        if (ent instanceof Ball) {
            GAME_DATA.data.balls[k++] = {radius: ent.radius, mass: ent.mass, color: ent.color,
                                            velocity: {x: ent.velocity.x, y: ent.velocity.y}, x: ent.x, y: ent.y};
        }
    }
    SOCKET.emit("save", GAME_DATA);
};

var loadGameState = function () {
    SOCKET.emit("load", { studentname: "Shawn Massoud", statename: "HW 3" });
};
