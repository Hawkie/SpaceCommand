import { Vector } from "../Data/Vector";
import { Transforms } from "../Physics/Transforms";
import { IActor } from "../Actors/Actor";
import { Coordinate } from "../Data/Coordinate";

export interface IAcceleratorInputs {
    readonly forces: Vector[];
    readonly mass: number;
}
export interface IAcceleratorOutputs {
    dVx: number;
    dVy: number;
}

// the Accelerator actor must be used to convert forces (and mass) to acceleration
// accelerator takes a vector of the current forces and a mass and creates a set of cartesian accelerations
// a= F/m, where dVx and dVy are the cartesian components of acceleration over that time period.
export class Accelerator implements IActor {

    constructor(private getProps: () => IAcceleratorInputs,
        private setOut:(out: IAcceleratorOutputs) => void) {

    }

    update(timeModifier: number): void {
        var out:IAcceleratorOutputs = Accelerator.accelerate(timeModifier, this.getProps());
        this.setOut(out);
    }

    static accelerate(timeModifer: number, props: IAcceleratorInputs): IAcceleratorOutputs {
        var vChange: IAcceleratorOutputs = {
            dVx: 0,
            dVy: 0,
        };
        props.forces.forEach((f) => {
            let velChange: Coordinate = Transforms.VectorToCartesian(f.angle, f.length/props.mass * timeModifer);
            vChange.dVx += velChange.x;
            vChange.dVy += velChange.y;
        });
        return vChange;
    }
}

export default Accelerator;