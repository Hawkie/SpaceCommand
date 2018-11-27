import { Canvas } from "../../gamelib/1Common/Canvas";
import { AsteroidAssets } from "../../game/Assets/assets";
import { EventLoop2 } from "./EventLoop2";
import { IStateProcessor } from "./StateProcessor";


export class Game2<TState> {


    private static _assets: AsteroidAssets = new AsteroidAssets();
    public static get assets(): AsteroidAssets { return this._assets; }

    // globals are doc and window
    run(window: Window, document: Document, state: TState, fsm: IStateProcessor<TState>): void {
        console.log("Game Run()");

        let canvas: Canvas = new Canvas(Game2.assets.width, Game2.assets.height, document);
        // let audioContext: AudioContext = new AudioContext();
        let gameloop: EventLoop2<TState> = new EventLoop2<TState>(document, window, canvas, state, fsm);

        gameloop.loop();
    }
}