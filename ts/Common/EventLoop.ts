import { Canvas } from "ts/Common/Canvas";
import { IGameState } from "ts/States/GameState";
import { DrawContext } from "ts/Common/DrawContext";
import { SparseArray } from "ts/Collections/SparseArray";
import { KeyStateProvider } from "ts/Common/KeyStateProvider";

export class EventLoop {

    private currentGameState: IGameState = null;
    constructor(private window: Window, private canvas: Canvas, private initialGameState: IGameState) {
        this.keyStateProvider = new KeyStateProvider(this.window);
        this.currentGameState = initialGameState;
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
        let gs : IGameState = this.currentGameState;
        gs.display(this.canvas.context());
        gs.tests(delta);
        gs.update(delta);
        gs.input(this.keyStateProvider, delta);
        if (gs.returnState() != null)
            this.currentGameState = gs.returnState();
    }

    keyStateProvider: KeyStateProvider;
}