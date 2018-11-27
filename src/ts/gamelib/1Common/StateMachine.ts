

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