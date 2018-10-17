import { Canvas } from "ts/gamelib/1Common/Canvas";
import { EventLoop } from "ts/gamelib/1Common/EventLoop";
import { Assets } from "ts/gamelib/1Common/Assets";
import { createGameStates } from "ts/game/Game/createGameStates";
import { IGameState } from "ts/gamelib/GameState/GameState";


export class Game {

    // globals are doc and window
    run(window: Window, document: Document): void {
        console.log("Game Run()");

        var canvas: Canvas = new Canvas(512, 480, document);
        var audioContext: AudioContext = new AudioContext();
        var assets: Assets = new Assets();
        var states: IGameState[] = createGameStates(assets, audioContext);
        var gameloop: EventLoop = new EventLoop(document, window, canvas, audioContext, states);

        gameloop.loop();
    }
}