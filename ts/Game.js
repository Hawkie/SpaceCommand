define(["require", "exports", "./Common/Canvas", "./Ship", "./Common/DisplayObject", "./Common/Coordinate", "./Common/EventLoop", "./DotField", "./GameState"], function (require, exports, Canvas_1, Ship_1, DisplayObject_1, Coordinate_1, EventLoop_1, DotField_1, GameState_1) {
    "use strict";
    var Game = (function () {
        function Game() {
        }
        // globals are doc and window
        Game.prototype.run = function (window, document) {
            console.log("Game Run()");
            //var SHIPPOINTS = [0, -4, -2, 2, 0, 1, 2, 2, 0, -4];
            var canvas = new Canvas_1.Canvas(512, 480, document);
            var points = new Array();
            points = [new Coordinate_1.Coordinate(0, -4), new Coordinate_1.Coordinate(-2, 2), new Coordinate_1.Coordinate(0, 1), new Coordinate_1.Coordinate(2, 2), new Coordinate_1.Coordinate(0, -4)];
            var poly = new DisplayObject_1.Polygon(points);
            var ship = new Ship_1.BasicShip(poly, new Coordinate_1.Coordinate(256, 240), 0, 0, 0, 0);
            //var ship = new RotatingPolygon(SHIPPOINTS, 256, 0, 240, 0, 0, 0);
            //var field1 = new ParticleField('img/star.png', 512, 200, 32, 1);
            var field2 = new DotField_1.DotField(-1, 0, 0, -16, 1, 1);
            //var field3 = new DotField(512, 200, 8, 1, 1, 1);
            var gameState = new GameState_1.PlayGameState(ship, [field2]);
            var gameloop = new EventLoop_1.EventLoop(window, canvas, gameState);
            console.log(ship.toString());
            gameloop.loop();
        };
        return Game;
    }());
    exports.Game = Game;
    ;
});
//# sourceMappingURL=Game.js.map