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

export interface IAccelerator {
    accelerate: (timeModifier: number, forces: IVector[], mass: number) => IAcceleratorOutputs;
}

// the Accelerator actor must be used to convert forces (and mass) to acceleration
// accelerator takes a vector of the current forces and a mass and creates a set of cartesian accelerations
// a= F/m, where dVx and dVy are the cartesian components of acceleration over that time period.
export class Accelerator implements IActor {

    constructor(private getInputs: () => IAcceleratorInputs,
        private setOut:(out: IAcceleratorOutputs) => void) {

    }

    update(timeModifier: number): void {
        let input: IAcceleratorInputs = this.getInputs();
        let result:IAcceleratorOutputs = accelerate(timeModifier, input.forces, input.mass);
        this.setOut(result);
    }
}

export function accelerate(timeModifer: number, forces: IVector[], mass: number): IAcceleratorOutputs {
    let vChange: IAcceleratorOutputs = {
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

export interface ISpeedable {
    Vx: number;
    Vy: number;
}

// reducer generates new object with new x and y values to go back into state
export function AccelerateWithVelocity<TState extends ISpeedable>(timeModifier: number,
        speedable: TState,
        forces: IVector[],
        mass: number): TState {
    let dV: ICoordinate = {
        x: 0,
        y: 0
    };
    forces.forEach((f) => {
        let velChange: ICoordinate = Transforms.VectorToCartesian(f.angle, f.length/mass * timeModifier);
        dV.x += velChange.x;
        dV.y += velChange.y;
    });
    return Object.assign({}, speedable, {
        Vx: speedable.Vx + dV.x,
        Vy: speedable.Vy + dV.y,
    });
}