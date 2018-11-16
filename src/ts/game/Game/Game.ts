import { Canvas } from "../../gamelib/1Common/Canvas";
import { EventLoop } from "../../gamelib/1Common/EventLoop";
// import { Assets } from "src/ts/gamelib/1Common/Assets";
import { createGameStates } from "../../game/Game/createGameStates";
import { IGameState } from "../../gamelib/GameState/GameState";
import { AsteroidAssets } from "../Assets/assets";


export class Game {

    private static _assets: AsteroidAssets = new AsteroidAssets();
    public static get assets(): AsteroidAssets { return this._assets; }

    // globals are doc and window
    run(window: Window, document: Document): void {
        console.log("Game Run()");

        let canvas: Canvas = new Canvas(512, 480, document);
        // let audioContext: AudioContext = new AudioContext();
        let states: IGameState[] = createGameStates();
        let gameloop: EventLoop = new EventLoop(document, window, canvas, states);

        gameloop.loop();
    }
}