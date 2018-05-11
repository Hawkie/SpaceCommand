import { Canvas } from "ts/gamelib/Common/Canvas";
import { EventLoop } from "ts/gamelib/Common/EventLoop";
import { Assets } from "ts/gamelib/Common/Assets";

import { IGameState } from "ts/States/GameState";
import { AsteroidState } from "ts/States/Asteroids/AsteroidState";
// import { LandingState } from "ts/States/Land/LandingState";
// import { SoundDesignerState } from "ts/States/SoundDesigner/SoundDesignerState";
// import { LandExplorerState } from "ts/States/LandExplorer/LandExplorerState";
// import { DuelState } from "ts/States/TwoPlayerDuel/DuelState";
import { MenuState, createMenu } from "ts/States/MenuState";


export class Game {

    // globals are doc and window
    run(window: any, document: any): void {
        console.log("Game Run()");

        var canvas: Canvas = new Canvas(512, 480, document);
        var audioContext: AudioContext = new AudioContext();
        var assets: Assets = new Assets();
        var states: IGameState[] = Game.createStates(assets, audioContext);
        var gameloop: EventLoop = new EventLoop(window, canvas, audioContext, states);

        gameloop.loop();
    }

    static createStates(assets: Assets, actx:AudioContext): IGameState[] {

        var menuState: IGameState = createMenu(assets, actx);
        var asteroidState: IGameState = AsteroidState.createState(assets, actx);
        // var landingState = LandingState.create(assets, actx);
        // var soundDesigner = SoundDesignerState.create();
        // var landExplorer = LandExplorerState.create(assets, actx);
        // var duel = DuelState.createState(assets, actx);

        // var states = [menuState, asteroidState, landingState, landExplorer, duel];
        var states: IGameState[] = [menuState, asteroidState];
        return states;
    }
}