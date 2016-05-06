import { DrawContext } from "../Common/DrawContext";
import { IDrawable, IDrawableAndRotatable } from "../DisplayObjects/DisplayObject";
import { PolyRotator } from "../Actors/Rotators";
import { Draw } from "../Effects/DrawRotated";
import { Mover } from "../Actors/Movers";
import { Coordinate } from "../Common/Coordinate";
import { Transforms } from "../Common/Transforms";
import { LocatedGO, ILocated, IAngled, IMoving, IGameObject } from "../GameObjects/GameObject";


export class LocatedAngledPolyGO extends LocatedGO implements IAngled {
    // add method policy here
    private rotator: IGameObject;

    constructor(protected drawable: IDrawableAndRotatable, public location: Coordinate, public angle: number = 0) {
        super(drawable, location);
        this.rotator = new PolyRotator(this, drawable);
        this.actors.push(this.rotator);
    }
}

export class MovingLocatedAngledPoly extends LocatedAngledPolyGO implements ILocated, IMoving {

    mover: IGameObject;
    constructor(protected drawable: IDrawableAndRotatable, public location: Coordinate, public velX: number, public velY: number, public angle: number = 0, public spin: number = 0) {
        super(drawable, location, angle);
        this.mover = new Mover(this);
        this.actors.push(this.mover);
    }

    update(timeModifier: number) {
        super.update(timeModifier);
        this.angle += this.spin * timeModifier;
    }
}