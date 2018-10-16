import { IActor } from "ts/gamelib/Actors/Actor";
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
        var sOut: ISpinnerOutputs = Spinner.spin(timeModifier, this.getIn());
        this.setOut(sOut);
    }
    static spin(timeModifier: number, sIn: ISpinnerInputs): ISpinnerOutputs {
        return {
            dAngle: sIn.spin * timeModifier
        };
    }
}