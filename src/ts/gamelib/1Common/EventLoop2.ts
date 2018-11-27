import { Canvas } from "./Canvas";
import { KeyStateProvider, Keys } from "./KeyStateProvider";
import { IState, createStateMachineProcessor } from "./State";
import { IStateProcessor } from "./StateProcessor";


export class EventLoop2 {

    keyStateProvider: KeyStateProvider;
    stateMachine: IStateProcessor<IState>;

    constructor(private document: Document,
        private window: Window,
        private canvas: Canvas,
        private state: IState) {
        this.keyStateProvider = new KeyStateProvider(this.document);
        this.stateMachine = createStateMachineProcessor();
    }

    loop(): void {
        let lastTime: number = 0;
        let myLoop: FrameRequestCallback = (time => {
            const delta: number = time - lastTime;
            if (delta < 1000) {
                let nextState: IState = this.processOneFrame(this.state, delta / 1000);
                // one place where we update state
                this.state = nextState;
            }
            lastTime = time;
            this.window.requestAnimationFrame(myLoop);
        });
        // request to do this again ASAP
        myLoop(20);
    }

    processOneFrame(state: IState, delta: number): IState {
        this.stateMachine.display(this.canvas.context(), state);
        let newState: IState = this.stateMachine.input(state, this.keyStateProvider, delta);
        newState = this.stateMachine.update(newState, delta);
        newState = this.stateMachine.sound(newState, delta);
        let idState: number = this.stateMachine.next(newState);
        if (idState !== undefined) {
            return {...newState,
                activeState: idState
            };
        }
        return newState;
    }


}