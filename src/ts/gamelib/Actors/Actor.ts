// data Updater

export interface IActor {
    update(timeModifier: number): void;
}

// the generic Actor allows the use of a func inside an actor object.
// takes an input of type T and applies a function with it.
export class Actor<T> implements IActor {
    constructor(private getInputs:() => T, private set: (inputs: T, timeModifier: number)=>void) {
    }

    update(timeModifier: number): void {
        var state: T = this.getInputs();
        this.set(state, timeModifier);
    }
}

