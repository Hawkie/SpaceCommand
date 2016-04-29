import { Canvas } from "./Canvas";
import { IGameState } from "../States/GameState";
import { DrawContext } from "./DrawContext";
import { SparseArray } from "../Collections/SparseArray";
import { KeyStateProvider } from "./KeyStateProvider";

export class EventLoop {

    constructor(private window: Window, private canvas: Canvas, private gameState: IGameState) {
        this.keyStateProvider = new KeyStateProvider(this.window);
    }

    loop() {
        var lastTime = 0;
        var myLoop: FrameRequestCallback = (time => {
            const delta = time - lastTime;
            if (delta < 1000) this.processOneFrame(delta / 1000);
            lastTime = time;
            this.window.requestAnimationFrame(myLoop);
        });
        // Request to do this again ASAP
        myLoop(20);
    }

    processOneFrame(delta: number) {
        const gs = this.gameState;
        gs.display(this.canvas.context());
        gs.tests();
        gs.update(delta);
        gs.input(this.keyStateProvider, delta);
    }

    keyStateProvider: KeyStateProvider;
}