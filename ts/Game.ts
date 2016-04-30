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

        var asteroidState = AsteroidState.create();
        var landingState = LandingState.create();
        var initialState = MenuState.create([asteroidState, landingState]);
       
        var gameloop = new EventLoop(window, canvas, initialState);

        gameloop.loop();
    }
};