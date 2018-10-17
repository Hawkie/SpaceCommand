import { Vector, IVector } from "../DataTypes/Vector";
import { Transforms } from "../Physics/Transforms";
import { IActor } from "../Actors/Actor";
import { Coordinate, ICoordinate } from "../DataTypes/Coordinate";

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

    constructor(private getInputs: () => IAcceleratorInputs,
        private setOut:(out: IAcceleratorOutputs) => void) {

    }

    update(timeModifier: number): void {
        var input: IAcceleratorInputs = this.getInputs();
        var result:IAcceleratorOutputs = accelerate(timeModifier, input.forces, input.mass);
        this.setOut(result);
    }
}

export function accelerate(timeModifer: number, forces: IVector[], mass: number): IAcceleratorOutputs {
    var vChange: IAcceleratorOutputs = {
        dVx: 0,
        dVy: 0,
    };
    forces.forEach((f) => {
        let velChange: ICoordinate = Transforms.VectorToCartesian(f.angle, f.length/mass * timeModifer);
        vChange.dVx += velChange.x;
        vChange.dVy += velChange.y;
    });
    return vChange;
}

export default Accelerator;