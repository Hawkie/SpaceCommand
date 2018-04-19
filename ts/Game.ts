import { Canvas } from "ts/Common/Canvas";
import { EventLoop } from "ts/Common/EventLoop";
import { Assets } from "ts/Resources/Assets";

import { IGameState } from "ts/States/GameState";
import { AsteroidState } from "ts/States/Asteroids/AsteroidState";
// import { LandingState } from "ts/States/Land/LandingState";
// import { SoundDesignerState } from "ts/States/SoundDesigner/SoundDesignerState";
// import { LandExplorerState } from "ts/States/LandExplorer/LandExplorerState";
// import { DuelState } from "ts/States/TwoPlayerDuel/DuelState";
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

    static createStates(assets: Assets, actx:AudioContext): IGameState[] {

        var menuState = MenuState.create(assets, actx);
        var asteroidState = AsteroidState.createState(assets, actx);
        // var landingState = LandingState.create(assets, actx);
        // var soundDesigner = SoundDesignerState.create();
        // var landExplorer = LandExplorerState.create(assets, actx);
        // var duel = DuelState.createState(assets, actx);

        // var states = [menuState, asteroidState, landingState, landExplorer, duel];
        var states = [menuState, asteroidState];
        return states;
    }
};