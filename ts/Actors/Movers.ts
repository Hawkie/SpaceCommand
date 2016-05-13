import { IActor } from "ts/Actors/Actor";
import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate } from "ts/Physics/Common";
import { ILocated, IMoving, ILocatedMoving } from "ts/Models/PolyModels";

export class Mover implements IActor {
    constructor(private locatedMoving: ILocatedMoving) { }

    update(timeModifier: number) {
        this.locatedMoving.location.x += this.locatedMoving.velX * timeModifier;
        this.locatedMoving.location.y += this.locatedMoving.velY * timeModifier;
    }
}