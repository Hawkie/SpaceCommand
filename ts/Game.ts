import { Canvas } from "./Common/Canvas";
import { EventLoop } from "./Common/EventLoop";

import { IGameState } from "./States/GameState";
import { AsteroidState } from "./States/AsteroidState";
import { LandingState } from "./States/LandingState";
import { MenuState } from "./States/MenuState";


export class Game {

    // globals are doc and window
    run(window, document) {
        console.log("Game Run()");
        

        var canvas = new Canvas(512, 480, document);

        var asteroidState = AsteroidState.create();
        var landingState = LandingState.create();
        //var initialState = MenuState.create([asteroidState]);
        var initialState = MenuState.create([asteroidState, landingState]);

        var gameloop = new EventLoop(window, canvas, initialState);

        gameloop.loop();
    }
};