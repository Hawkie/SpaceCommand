import { IVector } from "../DataTypes/Vector";
import { Transforms } from "../Physics/Transforms";
import { ICoordinate } from "../DataTypes/Coordinate";

// namespace Actor {}
export interface ISpeedable {
    Vx: number;
    Vy: number;
}



// reducer generates new object with new x and y values to go back into state
export function AccelerateWithForces<T extends ISpeedable>(speedable: T,
        timeModifier: number,
        forces: IVector[],
        mass: number): T {
        let dVx: number = 0;
        let dVy: number = 0;
    forces.forEach((f) => {
        let velChange: ICoordinate = Transforms.VectorToCartesian(f.angle, f.length/mass * timeModifier);
        dVx += velChange.x;
        dVy += velChange.y;
    });
    return Object.assign({}, speedable, {
        Vx: speedable.Vx + dVx,
        Vy: speedable.Vy + dVy,
    });
}

// var Accelerate: (speedable: ISpeedable, time: number, forces: IVector[], mass: number) => ISpeedable;
// accelerate = AccelerateWithForces<IShip>(speedable, time, forces, mass);