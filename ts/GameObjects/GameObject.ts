import { DrawContext } from "../Common/DrawContext";
import { IDrawable } from "../DisplayObjects/DisplayObject";
import { IActor } from "../Actors/Actor";
import { PolyRotator } from "../Actors/Rotators";
import { Mover } from "../Actors/Movers";
import { IEffect } from "../Effects/Effect";
import { Draw, DrawRotated } from "../Effects/DrawRotated";
import { Coordinate } from "../Common/Coordinate";
import { Transforms } from "../Common/Transforms";

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

export interface ILocatedAndAngled extends ILocated, IAngled {
}

export interface ILocatedAndMoving extends ILocated, IMoving {
}

// to be used shortly
export interface IForwardInteractor {
    forwardAcceleration(force: number);
}

// to be used shortly
export interface IAngularInteractor {
    angularAcceleration(force: number, angle: number);
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
    private rotator: IEffect;

    constructor(protected drawable: IDrawable, public location: Coordinate, public angle: number = 0) {
        super(drawable, location);
        this.rotator = new DrawRotated(this, drawable);
        this.effects.pop();
        this.effects.push(this.rotator);
    }
}

export class LocatedAngledMovingGO extends LocatedAngledGO implements IMoving {
    velX : number;
    velY : number;
    spin: number;
    mover: IActor;

    constructor(drawable: IDrawable, location : Coordinate, velX: number, velY: number, angle: number, spin: number) {
        super(drawable, location, angle);
        
        this.velX = velX;
        this.velY = velY;
        this.spin = spin;
        this.mover = new Mover(this);
        this.actors.push(this.mover);
    }
    
    update(timeModifier: number) {
        super.update(timeModifier);
        this.angle += this.spin * timeModifier;
    }
}

// TODO: Implement actual gravity
export class GravityGameObject extends LocatedAngledMovingGO{
    mass : number;
    gravitationalPull : number;
    weight : number;
    
    constructor(drawable: IDrawable, location : Coordinate, velx: number, vely: number, angle: number, spin: number, mass : number, gravitationalPull : number){
        super(drawable, location, velx, vely, angle, spin);
        this.mass = mass;
        this.gravitationalPull = gravitationalPull;
        this.weight = mass * gravitationalPull;
    }
    
    update(timeModifier : number){
        super.update(timeModifier);
        this.location.y -= this.weight * timeModifier;
    }
}
