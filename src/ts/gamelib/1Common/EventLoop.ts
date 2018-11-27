import { Canvas } from "./Canvas";
import { KeyStateProvider } from "./KeyStateProvider";
import { IStateProcessor } from "./StateProcessor";


export class EventLoop<TState> {

    keyStateProvider: KeyStateProvider;

    constructor(private document: Document,
        private window: Window,
        private canvas: Canvas,
        private state: TState,
        private stateMachine: IStateProcessor<TState>) {
        this.keyStateProvider = new KeyStateProvider(this.document);
    }

    loop(): void {
        let lastTime: number = 0;
        let myLoop: FrameRequestCallback = (time => {
            const delta: number = time - lastTime;
            if (delta < 1000) {
                let nextState: TState = this.processOneFrame(this.state, delta / 1000);
                // one place where we update state
                this.state = nextState;
            }
            lastTime = time;
            this.window.requestAnimationFrame(myLoop);
        });
        // request to do this again ASAP
        myLoop(20);
    }

    processOneFrame(state: TState, delta: number): TState {
        this.stateMachine.display(this.canvas.context(), state);
        let newState: TState = this.stateMachine.input(state, this.keyStateProvider, delta);
        newState = this.stateMachine.update(newState, delta);
        newState = this.stateMachine.sound(newState, delta);
        let idState: number = this.stateMachine.next(newState);
        if (idState !== undefined) {
            return Object.assign({}, newState, {
                activeState: idState
            });
        }
        return newState;
    }


}