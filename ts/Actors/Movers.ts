import { DrawContext } from "../Common/DrawContext";
import { Coordinate } from "../Common/Coordinate";
import { IGameObject, ILocated, IMoving, ILocatedAndMoving } from "../GameObjects/GameObject";
import { IDrawable, IDrawableAndRotatable } from "../DisplayObjects/DisplayObject";

export class Mover implements IGameObject {
    constructor(private locatedMoving: ILocatedAndMoving) { }

    update(timeModifier: number) {
        this.locatedMoving.location.x += this.locatedMoving.velX * timeModifier;
        this.locatedMoving.location.y += this.locatedMoving.velY * timeModifier;
    }

    display(drawContext: DrawContext) { }
}