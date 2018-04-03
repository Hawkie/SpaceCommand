import { Vector, OrthogonalVectors } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { IActor } from "ts/Actors/Actor";
import { ILocated, IMoving, IAngled, IForces } from "ts/Data/PhysicsData";
import { Coordinate } from "ts/Physics/Common";

export interface IForceProps {
    length: number;
    angle: number;
}

export interface IOut {
    Vx: number;
    Vy: number;
}

export class Out implements IOut {
    constructor(public Vx:number = 0, public Vy:number = 0) {}
}

export interface IAcceleratorProps {
    readonly x: number;
    readonly y: number;
    readonly Vx: number;
    readonly Vy: number;
    readonly forces: IForceProps[];
    readonly mass: number;
}


export class Accelerator implements IActor {

    constructor(private getProps: () => IAcceleratorProps,
        private setOut:(out: IOut) => void) {

    }

    update(timeModifier: number): void {
        var out:IOut = this.accelerate(timeModifier, this.getProps());
        this.setOut(out);
    }

    accelerate(timeModifer: number, props: IAcceleratorProps): IOut {
        var vChange: IOut = new Out(0, 0);
        props.forces.forEach((f) => {
            let velChange: Coordinate = Transforms.VectorToCartesian(f.angle, f.length/props.mass * timeModifer);
            vChange.Vx += velChange.x;
            vChange.Vy += velChange.y;
        });
        return vChange;
    }
}

export default Accelerator;