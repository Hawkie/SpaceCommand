import { IActor } from "ts/Actors/Actor";
import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate } from "ts/Physics/Common";
import { ILocated, IMoving  } from "ts/Models/PolyModels";
import { ILocatedMoving } from "ts/Data/PhysicsData";

export class Mover implements IActor {
    constructor(private locatedMoving: ILocatedMoving) { }

    update(timeModifier: number) {
        this.locatedMoving.location.x += this.locatedMoving.velX * timeModifier;
        this.locatedMoving.location.y += this.locatedMoving.velY * timeModifier;
    }
}