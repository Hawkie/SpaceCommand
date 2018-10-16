import { Canvas } from "ts/gamelib/1Common/Canvas";
import { IGameState } from "ts/gamelib/GameState/GameState";
import { KeyStateProvider } from "ts/gamelib/1Common/KeyStateProvider";

export class EventLoop {

    currentState: IGameState;
    constructor(private document: Document,
        private window: Window,
        private canvas: Canvas,
        private audioContext: AudioContext,
        private states: IGameState[]) {
        this.keyStateProvider = new KeyStateProvider(this.document);
        this.currentState = states[0];
    }

    loop(): void {
        var lastTime: number = 0;
        var myLoop: FrameRequestCallback = (time => {
            const delta: number = time - lastTime;
            if (delta < 1000) {
                this.processOneFrame(delta / 1000);
            }
            lastTime = time;
            this.window.requestAnimationFrame(myLoop);
        });
        // request to do this again ASAP
        myLoop(20);
    }

    processOneFrame(delta: number): void {
        let gs : IGameState = this.currentState;
        gs.display(this.canvas.context());
        gs.sound(this.audioContext);
        gs.tests(delta);
        gs.update(delta);
        gs.input(this.keyStateProvider, delta);
        var newState: number = gs.returnState();
        if (newState !== undefined) {
            this.currentState = this.states[newState];
        }
    }

    keyStateProvider: KeyStateProvider;
}