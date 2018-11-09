import { Canvas } from "../../gamelib/1Common/Canvas";
import { EventLoop } from "../../gamelib/1Common/EventLoop";
// import { Assets } from "src/ts/gamelib/1Common/Assets";
import { createGameStates } from "../../game/Game/createGameStates";
import { IGameState } from "../../gamelib/GameState/GameState";


export class Game {

    // globals are doc and window
    run(window: Window, document: Document): void {
        console.log("Game Run()");

        let canvas: Canvas = new Canvas(512, 480, document);
        // let audioContext: AudioContext = new AudioContext();
        // let assets: Assets = new Assets();
        let states: IGameState[] = createGameStates();
        let gameloop: EventLoop = new EventLoop(document, window, canvas, states);

        gameloop.loop();
    }
}