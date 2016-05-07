import { DrawContext } from "../Common/DrawContext";
import { IDrawable, IDrawableAndRotatable } from "../DisplayObjects/DisplayObject";
import { PolyRotator, Spinner } from "../Actors/Rotators";
import { Draw } from "../Effects/DrawRotated";
import { IActor } from "../Actors/Actor";
import { Mover } from "../Actors/Movers";
import { VectorAccelerator } from "../Actors/Accelerators";
import { Coordinate, IVector, Vector } from "../Physics/Common";
import { Transforms } from "../Physics/Transforms";
import { LocatedGO, ILocated, IAngled, IMoving, IGameObject, IRotating } from "../GameObjects/GameObject";


export class LocatedAngledPoly extends LocatedGO implements IAngled {

    constructor(protected drawable: IDrawableAndRotatable, public location: Coordinate, public angle: number = 0) {
        super(drawable, location);
        var rotator = new PolyRotator(this, drawable);
        this.actors.push(rotator);
    }
}

export class MovingLocatedAngledPoly extends LocatedAngledPoly implements ILocated, IMoving {

    constructor(drawable: IDrawableAndRotatable, location: Coordinate, public velX: number, public velY: number, public angle: number = 0, public spin: number = 0) {
        super(drawable, location, angle);
        var mover = new Mover(this);
        this.actors.push(mover);
    }
}

export class LocatedAngledMovingRotatingPoly extends MovingLocatedAngledPoly implements IRotating {
    constructor(drawable: IDrawableAndRotatable, location: Coordinate, velX: number, velY: number, angle: number = 0, public spin: number = 0) {
        super(drawable, location, velX, velY, angle);
        var spinner : IActor = new Spinner(this);
        this.actors.push(spinner);
    }
}

// TODO: Implement actual gravity
export class GravityGameObjectPoly extends LocatedAngledMovingRotatingPoly {

    constructor(drawable: IDrawableAndRotatable, location: Coordinate, velx: number, vely: number, angle: number, spin: number, public gravityForce: Vector) {
        super(drawable, location, velx, vely, angle, spin);
        this.actors.push(new VectorAccelerator(this, gravityForce));
    }
}