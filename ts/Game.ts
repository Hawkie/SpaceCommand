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
        var states = Game.createStates(assets, audioContext);
        var gameloop = new EventLoop(window, canvas, audioContext, states);

        gameloop.loop();
    }

    static createStates(assets: Assets, audioContext:AudioContext): IGameState[] {

        var menuState = MenuState.create(assets, audioContext);
        var asteroidState = AsteroidState.createState(assets, audioContext);
        var landingState = LandingState.create(assets);
        var soundDesigner = SoundDesignerState.create();

        var states = [menuState, asteroidState, landingState, soundDesigner];

        return states;
    }
};