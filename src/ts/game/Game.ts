import { Canvas } from "ts/gamelib/1Common/Canvas";
import { EventLoop } from "ts/gamelib/1Common/EventLoop";
import { Assets } from "ts/gamelib/1Common/Assets";
import { createStates } from "ts/game/States/MenuState";
import { IGameState } from "ts/gamelib/GameState/GameState";


export class Game {

    // globals are doc and window
    run(window: any, document: any): void {
        console.log("Game Run()");

        var canvas: Canvas = new Canvas(512, 480, document);
        var audioContext: AudioContext = new AudioContext();
        var assets: Assets = new Assets();
        var states: IGameState[] = createStates(assets, audioContext);
        var gameloop: EventLoop = new EventLoop(document, window, canvas, audioContext, states);

        gameloop.loop();
    }
}