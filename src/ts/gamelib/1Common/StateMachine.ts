import { IStateProcessor } from "./StateProcessor";
import { DrawContext } from "./DrawContext";
import { KeyStateProvider } from "./KeyStateProvider";


// export function Next<TState>(state: TState, input:): TState {

//     this.stateMachine.display(this.canvas.context(), state);
//     let newState: TState = this.stateMachine.input(state, this.keyStateProvider, delta);
//     newState = this.stateMachine.update(newState, delta);
//     newState = this.stateMachine.sound(newState, delta);
//     let idState: number = this.stateMachine.next(newState);
//     if (idState !== undefined) {
//         return Object.assign({}, newState, {
//             activeState: idState
//         });
//     }
// }

export interface IState {
    readonly activeState: number;
    readonly states: ReadonlyArray<any>;
    readonly behaviours: ReadonlyArray<any>;
}


export function createStateMachineProcessor(): IStateProcessor<IState> {
    return {
        id: 0,
        name: "StateMachine",
        sound: SoundTotal,
        display: DisplayTotal,
        input: InputTotal,
        update: UpdateTotal,
        next: NextTotal,
    };
}

export function NextTotal(state: IState): number {
    return state.behaviours[state.activeState].next(state.states[state.activeState]);
}

export function DisplayTotal(ctx:DrawContext, state:IState): void {
    state.behaviours[state.activeState].display(ctx, state.states[state.activeState]);
}

// remove old state from Array of states and replace with new
export function InputTotal(state: IState, keys: KeyStateProvider): IState {
    let newStates: any[] = state.states.map(s => s);
    let newState: any = state.behaviours[state.activeState].input(state.states[state.activeState], keys);
    newStates.splice(state.activeState, 1, newState);
    return {...state,
        states: newStates
    };
}

export function UpdateTotal(state: IState, timeModifier: number): IState {
    let newStates: any[] = state.states.map(s => s);
    let newState: any = state.behaviours[state.activeState].update(state.states[state.activeState], timeModifier);
    newStates.splice(state.activeState, 1, newState);
    return {...state,
        states: newStates
    };
}

export function SoundTotal(state: IState, timeModifier: number): IState {
    let newStates: any[] = state.states.map(s => s);
    let newState: any = state.behaviours[state.activeState].sound(state.states[state.activeState], timeModifier);
    newStates.splice(state.activeState, 1, newState);
    return {...state,
        states: newStates
    };
}
