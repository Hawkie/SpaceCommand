import { Canvas } from "ts/Common/Canvas";
import { EventLoop } from "ts/Common/EventLoop";
import { Assets } from "ts/Resources/Assets";

import { IGameState } from "ts/States/GameState";
import { AsteroidState } from "ts/States/AsteroidState";
import { LandingState } from "ts/States/LandingState";
import { SoundDesignerState } from "ts/States/SoundDesignerState";
import { MenuState } from "ts/States/MenuState";


export class Game {

    // globals are doc and window
    run(window, document) {
        console.log("Game Run()");
        

        var canvas = new Canvas(512, 480, document);
        var audioContext = new AudioContext();
        var assets = new Assets();

        var asteroidState = AsteroidState.create(assets, audioContext);
        var landingState = LandingState.create(assets);
        var soundDesigner = SoundDesignerState.create();
        var initialState = MenuState.create(assets, audioContext, [asteroidState, landingState, soundDesigner]);

        var gameloop = new EventLoop(window, canvas, audioContext, initialState);

        gameloop.loop();
    }
};