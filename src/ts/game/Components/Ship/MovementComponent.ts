import { UpdateConnection } from "../../../gamelib/Actors/CompositeAccelerator";
import { MoveWithVelocity } from "../../../gamelib/Actors/Movers";
import { RotateShape } from "../../../gamelib/Actors/Rotators";
import { IShip } from "./ShipComponent";
import { Wrap } from "../../../gamelib/Actors/Wrap";
import { Game } from "../../Game/Game";
import { AccelerateWithForces, ISpeedable } from "../../../gamelib/Actors/Accelerator";

export function ShipCopyToMoved(ship: IShip, timeModifier: number): IShip {
    let newShip: IShip = ship;
    if (ship.attached) {
        newShip = UpdateConnection(newShip, timeModifier, newShip.mass, [newShip.thrust], 2);
    } else {
        newShip = AccelerateWithForces(newShip, timeModifier, [newShip.thrust], newShip.mass);
    }
    newShip = MoveWithVelocity(timeModifier, newShip, newShip.Vx, newShip.Vy);
    newShip = RotateShape(timeModifier, newShip, newShip.spin);
    if (newShip.wrapped) {
        newShip = {...newShip,
            x: Wrap(newShip.x, 0, Game.assets.width),
            y: Wrap(newShip.y, 0, Game.assets.height)
        };
    }
    return newShip;
}