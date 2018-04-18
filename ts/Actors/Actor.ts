// data Updater

export interface IActor {
    update(timeModifier: number): void;
}

export class Actor<T> implements IActor {
    constructor(private getInputs:() => T, private set: (inputs: T, timeModifier: number)=>void) {
    }

    update(timeModifier: number): void {
        var state: T = this.getInputs();
        this.set(state, timeModifier);
    }
}