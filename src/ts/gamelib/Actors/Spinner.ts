import { IActor } from "../Actors/Actor";
export interface ISpinnerInputs {
    spin: number;
}

export interface ISpinnerOutputs {
    dAngle: number;
}
export class Spinner implements IActor {
    constructor(private getIn: () => ISpinnerInputs, private setOut: (out: ISpinnerOutputs) => void) {
    }
    update(timeModifier: number): void {
        const input: ISpinnerInputs = this.getIn();
        var sOut: ISpinnerOutputs = spin(timeModifier, input.spin);
        this.setOut(sOut);
    }
}

export function spin(timeModifier: number, spin: number): ISpinnerOutputs {
    return {
        dAngle: spin * timeModifier
    };
}