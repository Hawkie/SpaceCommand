import { Canvas } from "./Common/Canvas";

import { IGameObject, StaticGameObject, MovingGameObject } from "./Common/GameObject";
import { BasicShip } from "./Ships/Ship"
import { LandingBasicShip } from "./Ships/LandingShip";

import { Polygon } from "./DisplayObjects/DisplayObject";
import { Coordinate } from "./Common/Coordinate";
import { EventLoop } from "./Common/EventLoop";

import { DotField } from "./Space/DotField";
import { Asteroid } from "./Space/Asteroid"
import { AsteroidState } from "./States/AsteroidState"
import { LandingState } from "./States/LandingState";
import { IGameState } from "./States/GameState";
import { MenuState } from "./States/MenuState";
import { GuiText } from "./Gui/GuiText";


export class Game {

    // globals are doc and window
    run(window, document) {
        console.log("Game Run()");
        

        var canvas = new Canvas(512, 480, document);

        // Background
        //var field1 = new ParticleField('img/star.png', 512, 200, 32, 1);
        var field2 = new DotField(-1, 0, 0, -16, 1, 1);
        //var field3 = new DotField(512, 200, 8, 1, 1, 1);

        // special
        let asteroid1 = new Asteroid(new Coordinate(200, 230), 2, 2, 40, -2);

        // ships
        let ship = new BasicShip(new Coordinate(256, 240), 0, 0, 0, 0);
        let landingShip = new LandingBasicShip(new Coordinate(256, 240));
        

        var text = new GuiText("SpaceCommander", new Coordinate(10, 20), "Arial", 18);
        var objects : Array<IGameObject> = [field2, text];
        var asteroids: Array<Asteroid> = [asteroid1];

        var asteroidState = new AsteroidState(ship, objects, asteroids);
        var landingState = new LandingState(landingShip, objects);


        var initialState = new MenuState(["Asteroids", "Landing"], objects, [asteroidState, landingState]);
       
        var gameloop = new EventLoop(window, canvas, initialState);
        console.log(ship.toString());

        gameloop.loop();
    }
};