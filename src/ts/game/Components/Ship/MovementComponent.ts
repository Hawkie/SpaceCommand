import { UpdateConnection } from "../../../gamelib/Actors/CompositeAccelerator";
import { MoveWithVelocity } from "../../../gamelib/Actors/Movers";
import { RotateShape, RotateAngle } from "../../../gamelib/Actors/Rotators";
import { IShip } from "./ShipComponent";
import { AccelerateWithForces } from "../../../gamelib/Actors/Accelerator";
import { IVector, Vector } from "../../../gamelib/DataTypes/Vector";


export function MoveShip(ship: IShip, timeModifier: number): IShip {
    let newShip: IShip = ship;
    newShip = RotateAngle(newShip, ship.spin, timeModifier);
    let forces: IVector = new Vector(newShip.angle, newShip.forwardThrust);
    newShip = AccelerateWithForces(newShip, timeModifier, [forces], newShip.mass);
    newShip = MoveWithVelocity(timeModifier, newShip, newShip.Vx, newShip.Vy);
    newShip = RotateShape(timeModifier, newShip, newShip.spin);
    return newShip;
}


export function MoveAttachedShip(ship: IShip, timeModifier: number): IShip {
    let newShip: IShip = ship;
    newShip = RotateAngle(newShip, ship.spin, timeModifier);
    let forces: IVector = new Vector(newShip.angle, newShip.forwardThrust);
    newShip = UpdateConnection(newShip, timeModifier, newShip.mass, [forces], 2);
    newShip = MoveWithVelocity(timeModifier, newShip, newShip.Vx, newShip.Vy);
    newShip = RotateShape(timeModifier, newShip, newShip.spin);
    return newShip;
}