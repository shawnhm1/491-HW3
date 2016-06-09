// the "main" code begins here
var ASSET_MANAGER = new AssetManager();
var GAME_ENGINE = new GameEngine();


ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('Table');
    var ctx = canvas.getContext('2d');

    GAME_ENGINE.init(ctx);
    GAME_ENGINE.start();
});
