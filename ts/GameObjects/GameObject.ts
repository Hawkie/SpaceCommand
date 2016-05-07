import { DrawContext } from "../Common/DrawContext";
import { IDrawable } from "../DisplayObjects/DisplayObject";
import { IActor } from "../Actors/Actor";
import { PolyRotator, Spinner } from "../Actors/Rotators";
import { Mover } from "../Actors/Movers";
import { VectorAccelerator } from "../Actors/Accelerators";
import { IEffect } from "../Effects/Effect";
import { Draw, DrawRotated } from "../Effects/DrawRotated";
import { Coordinate, IVector, Vector } from "../Physics/Common";
import { Transforms } from "../Physics/Transforms";

export interface IGameObject
{
    update(timeModifier : number);
    display(drawingContext : DrawContext);
}

export interface ILocated {
    location: Coordinate;
}

export interface IAngled {
    angle: number;
}

export interface IMoving {
    velX: number;
    velY: number;
}

export interface IRotating {
    spin: number;
}

export interface IForwardAccelerator {
    forwardForce: number;
}

export interface ILocatedAndAngled extends ILocated, IAngled {
}

export interface ILocatedAndMoving extends ILocated, IMoving {
}

export interface IAngledAndRotating extends IAngled, IRotating {
}

export interface IAngledMovingForwardAcc extends IAngled, IMoving, IForwardAccelerator { }

export interface IMovingVecAcc extends IMoving, IVector { }

// to be used shortly
export interface IAngularInteractor {
    anyAcceleration(force: number, angle: number);
}

export class LocatedGO implements IGameObject, ILocated {
    
    actors: IActor[];
    effects: IEffect[];

    constructor(protected drawable: IDrawable, public location: Coordinate) {
        this.actors = [];
        this.effects = [];
        this.effects.push(new Draw(this, this.drawable));
    }
    
    update(timeModifier: number) {
        this.actors.forEach(a => a.update(timeModifier));
    }
    
    display(drawContext: DrawContext) {
        this.effects.forEach(e => e.display(drawContext));
    }
}

export class LocatedAngledGO extends LocatedGO implements IAngled {
// add method policy here

    constructor(drawable: IDrawable, location: Coordinate, public angle: number = 0) {
        super(drawable, location);
        var drawRotated: IEffect = new DrawRotated(this, drawable);

        // remove normal draw
        this.effects.pop();
        this.effects.push(drawRotated);
    }
}

export class LocatedAngledMovingGO extends LocatedAngledGO implements IMoving {
    constructor(drawable: IDrawable, location : Coordinate, public velX: number = 0, public velY: number = 0, angle: number) {
        super(drawable, location, angle);
        
        this.velX = velX;
        this.velY = velY;
        var mover : IActor = new Mover(this);
        this.actors.push(mover);
    }
}

export class LocatedAngledMovingRotating extends LocatedAngledMovingGO implements IRotating {
    constructor(drawable: IDrawable, location: Coordinate, velX: number = 0, velY: number = 0, angle: number = 0, public spin: number = 0) {
        super(drawable, location, velX, velY, angle);
        var spinner: IActor = new Spinner(this);
        this.actors.push(spinner);
    }
}

// TODO: Implement actual gravity
export class GravityGameObject extends LocatedAngledMovingRotating {
    
    constructor(drawable: IDrawable, location : Coordinate, velx: number, vely: number, angle: number, spin: number, public gravityForce: Vector){
        super(drawable, location, velx, vely, angle, spin);
        this.actors.push(new VectorAccelerator(this, gravityForce));
    }
}
