import { DrawContext } from "ts/Common/DrawContext";
import { Canvas } from "ts/Common/Canvas";
import { IGameState } from "ts/States/GameState";
import { SparseArray } from "ts/Collections/SparseArray";
import { KeyStateProvider } from "ts/Common/KeyStateProvider";

export class EventLoop {

    currentState: IGameState;
    constructor(private window: Window, private canvas: Canvas, private audioContext: AudioContext, private states: IGameState[]) {
        this.keyStateProvider = new KeyStateProvider(this.window);
        this.currentState = states[0];
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
        let gs : IGameState = this.currentState;
        gs.display(this.canvas.context());
        gs.sound(this.audioContext);
        gs.tests(delta);
        gs.update(delta);
        gs.input(this.keyStateProvider, delta);
        var newState = gs.returnState();
        if (newState != undefined)
            this.currentState = this.states[newState];
    }

    keyStateProvider: KeyStateProvider;
}