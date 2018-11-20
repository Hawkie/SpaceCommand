import { IVector } from "../DataTypes/Vector";
import { Transforms } from "../Physics/Transforms";
import { ICoordinate } from "../DataTypes/Coordinate";

export interface ISpeedable {
    Vx: number;
    Vy: number;
}

// reducer generates new object with new x and y values to go back into state
export function AccelerateWithForces<TState extends ISpeedable>(timeModifier: number,
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