import { UpdateConnection } from "../../../gamelib/Actors/CompositeAccelerator";
import { MoveWithVelocity } from "../../../gamelib/Actors/Movers";
import { RotateShape } from "../../../gamelib/Actors/Rotators";
import { IShip } from "./ShipComponent";
import { Wrap } from "../../../gamelib/Actors/Wrap";
import { Game } from "../../Game/Game";
import { AccelerateWithForces, ISpeedable } from "../../../gamelib/Actors/Accelerator";

export function MoveShip(ship: IShip, timeModifier: number): IShip {
    let newShip: IShip = ship;
    newShip = AccelerateWithForces(newShip, timeModifier, [newShip.thrust], newShip.mass);
    newShip = MoveWithVelocity(timeModifier, newShip, newShip.Vx, newShip.Vy);
    newShip = RotateShape(timeModifier, newShip, newShip.spin);
    return newShip;
}

export function MoveAttachedShip(ship: IShip, timeModifier: number): IShip {
    let newShip: IShip = ship;
    newShip = UpdateConnection(newShip, timeModifier, newShip.mass, [newShip.thrust], 2);
    newShip = MoveWithVelocity(timeModifier, newShip, newShip.Vx, newShip.Vy);
    newShip = RotateShape(timeModifier, newShip, newShip.spin);
    return newShip;
}