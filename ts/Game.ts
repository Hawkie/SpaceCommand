import { Canvas } from "./Common/Canvas";
import { StaticGameObject, MovingGameObject, Ship } from "./Common/GameObject";
import { Polygon } from "./Common/DisplayObject";
import { Coordinate } from "./Common/Coordinate";
import { EventLoop } from "./Common/EventLoop";

import { DotField } from "./DotField";
import { PlayGameState } from "./GameState"


export class Game {

    // globals are document and window
    run(window, document) {
        console.log("Game Run()");
        //var SHIPPOINTS = [0, -4, -2, 2, 0, 1, 2, 2, 0, -4];

        var canvas = new Canvas(512, 480, document);
        let points = new Array<Coordinate>();
        points = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];
        var poly = new Polygon(points)
        let ship = new Ship(poly, new Coordinate(256, 240), 0, 0, 0, 0);
        //var ship = new RotatingPolygon(SHIPPOINTS, 256, 0, 240, 0, 0, 0);
        //var field1 = new ParticleField('img/star.png', 512, 200, 32, 1);
        var field2 = new DotField(-1, 0, 0, -16, 1, 1);
        //var field3 = new DotField(512, 200, 8, 1, 1, 1);

        var gameState = new PlayGameState(ship, [field2]);

        var gameloop = new EventLoop(window, canvas, gameState);
        console.log(ship.toString());

        gameloop.loop();
    }
};