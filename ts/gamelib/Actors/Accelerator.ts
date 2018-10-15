import { Vector } from "ts/gamelib/Data/Vector";
import { Transforms } from "ts/gamelib/Physics/Transforms";
import { IActor } from "ts/gamelib/Actors/Actor";
// import { ILocated, IMoving, IAngled, IForces } from "ts/gamelib/Data/PhysicsData";
import { Coordinate } from "ts/gamelib/Data/Coordinate";

export interface IAcceleratorOutputs {
    dVx: number;
    dVy: number;
}

// export class Out implements IAcceleratorOutputs {
//     constructor(public dVx:number = 0, public dVy:number = 0) {}
// }

export interface IAcceleratorInputs {
    readonly x: number;
    readonly y: number;
    readonly Vx: number;
    readonly Vy: number;
    readonly forces: Vector[];
    readonly mass: number;
}


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