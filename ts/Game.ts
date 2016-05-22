import { Canvas } from "ts/Common/Canvas";
import { SoundContext } from "ts/Sound/SoundContext";
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
        var soundContext = new SoundContext();
        var assets = new Assets();

        var asteroidState = AsteroidState.create(assets);
        var landingState = LandingState.create();
        var soundDesigner = SoundDesignerState.create();
        var initialState = MenuState.create(assets, soundContext.actx, [asteroidState, landingState, soundDesigner]);

        var gameloop = new EventLoop(window, canvas, soundContext, initialState);

        gameloop.loop();
    }
};