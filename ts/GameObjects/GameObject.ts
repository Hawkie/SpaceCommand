import { DrawContext } from "../Common/DrawContext";
import { IDrawable } from "../DisplayObjects/DisplayObject";
import { GeneralRotator, PolyRotator } from "../Actors/Rotators";
import { Mover } from "../Actors/Movers";
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
    constructor(protected drawable: IDrawable, public location: Coordinate) {
    }
    
    update(timeModifier: number) {
        //this.Properties.forEach(p => p.update
    }
    
    display(drawContext: DrawContext) {
        this.drawable.draw(this.location, drawContext);
    }
}

export class LocatedAngledGO extends LocatedGO implements IAngled {
// add method policy here
    private rotator: IGameObject;

    constructor(protected drawable: IDrawable, public location: Coordinate, public angle: number = 0) {
        super(drawable, location);
        this.rotator = new GeneralRotator(this, drawable);
    }

    update(timeModifier: number) {
        super.update(timeModifier);
        this.rotator.update(timeModifier);
    }

    // does not call superclass on purpose!
    display(drawContext: DrawContext) {
        this.rotator.display(drawContext);
    }
}

export class LocatedAngledMovingGO extends LocatedAngledGO implements IMoving {
    velX : number;
    velY : number;
    spin: number;
    mover: IGameObject;

    constructor(drawable: IDrawable, location : Coordinate, velX: number, velY: number, angle: number, spin: number) {
        super(drawable, location, angle);
        
        this.velX = velX;
        this.velY = velY;
        this.spin = spin;
        this.mover = new Mover(this);
    }
    
    update(timeModifier: number) {
        super.update(timeModifier);
        this.mover.update(timeModifier);
        this.angle += this.spin * timeModifier;
    }
    
    display(drawingContext : DrawContext){
        super.display(drawingContext);
        this.mover.display(drawingContext);
    }
    
    protected angularThrust(thrust : number) {
        let velChange = Transforms.VectorToCartesian(this.angle, thrust);
        this.velX += velChange.x;
        this.velY += velChange.y;
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
