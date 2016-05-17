import { Canvas } from "ts/Common/Canvas";
import { SoundContext } from "ts/Sound/SoundContext";
import { EventLoop } from "ts/Common/EventLoop";

import { IGameState } from "ts/States/GameState";
import { AsteroidState } from "ts/States/AsteroidState";
import { LandingState } from "ts/States/LandingState";
import { MenuState } from "ts/States/MenuState";


export class Game {

    // globals are doc and window
    run(window, document) {
        console.log("Game Run()");
        

        var canvas = new Canvas(512, 480, document);
        var soundContext = new SoundContext();

        var asteroidState = AsteroidState.create();
        var landingState = LandingState.create();
        var initialState = MenuState.create([asteroidState, landingState]);

        var gameloop = new EventLoop(window, canvas, soundContext, initialState);

        gameloop.loop();
    }
};