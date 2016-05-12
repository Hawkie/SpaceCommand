import { IActor } from "../Actors/Actor";
import { DrawContext } from "../Common/DrawContext";
import { Coordinate } from "../Physics/Common";
import { ILocated, IMoving, ILocatedMoving } from "../Models/PolyModels";

export class Mover implements IActor {
    constructor(private locatedMoving: ILocatedMoving) { }

    update(timeModifier: number) {
        this.locatedMoving.location.x += this.locatedMoving.velX * timeModifier;
        this.locatedMoving.location.y += this.locatedMoving.velY * timeModifier;
    }
}