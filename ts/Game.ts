import { Canvas } from "./Common/Canvas";

import { IGameObject, StaticGameObject, MovingGameObject } from "./Common/GameObject";
import { BasicShip } from "./Ships/Ship"
import { LandingBasicShip } from "./Ships/LandingShip";

import { Polygon } from "./Common/DisplayObject";
import { Coordinate } from "./Common/Coordinate";
import { EventLoop } from "./Common/EventLoop";

import { DotField } from "./Space/DotField";
import { Asteroid } from "./Space/Asteroid"
import { PlayGameState } from "./States/GameState"
import { LandingState } from "./States/LandingState";


export class Game {

    // globals are doc and window
    run(window, document) {
        console.log("Game Run()");
        

        var canvas = new Canvas(512, 480, document);
        let asteroid1 = new Asteroid(new Coordinate(200, 230), 2, 2, 40, -2);
        let ship = new BasicShip(new Coordinate(256, 240), 0, 0, 0, 0);
        let landingShip = new LandingBasicShip(new Coordinate(256, 240));
        //var ship = new RotatingPolygon(SHIPPOINTS, 256, 0, 240, 0, 0, 0);
        //var field1 = new ParticleField('img/star.png', 512, 200, 32, 1);
        var field2 = new DotField(-1, 0, 0, -16, 1, 1);
        //var field3 = new DotField(512, 200, 8, 1, 1, 1);
        var objects : Array<IGameObject> = [field2];
        var asteroids : Array<Asteroid> = [asteroid1];

        //var gameState = new PlayGameState(ship, objects, asteroids);
        var gameState = new LandingState(landingShip, objects);

        var gameloop = new EventLoop(window, canvas, gameState);
        console.log(ship.toString());

        gameloop.loop();
    }
};