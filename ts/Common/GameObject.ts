import { DrawContext } from "./DrawContext";
import { IDrawable } from "../DisplayObjects/DisplayObject";
import { GeneralRotator, PolyRotator } from "../Properties/Rotators";
import { Coordinate } from "./Coordinate";
import { Transforms } from "./Transforms";

export interface IGameObject
{
    update(timeModifier : number);
    display(drawingContext : DrawContext);
}

export interface IDrawableProperties {
    location: Coordinate;
}

export interface IRotatableProperties {
    angle: number;
}

export interface IDrawableAndRotatableProperties extends IDrawableProperties, IRotatableProperties { }

export class StaticGameObject implements IGameObject, IDrawableProperties {
    
    // add properties
    // rotatable
    // moving
    constructor(protected drawable: IDrawable, public location : Coordinate){
    }
    
    update(timeModifier : number){}
    
    display(drawContext: DrawContext) {
        this.drawable.draw(this.location, drawContext);
    }
}

export class RotatedGameObject extends StaticGameObject implements IRotatableProperties {
// add method policy here
    private rotator: GeneralRotator;

    constructor(protected drawable: IDrawable, public location: Coordinate, public angle: number = 0) {
        super(drawable, location);
        this.rotator = new GeneralRotator(this, drawable);
    }

    update(timeModifier: number) {
        this.rotator.update(timeModifier);
    }

    display(drawContext: DrawContext) {
        this.rotator.display(drawContext);
    }
}

export class MovingGameObject extends RotatedGameObject{
    velX : number;
    velY : number;
    spin: number;

    constructor(drawable: IDrawable, location : Coordinate, velX: number, velY: number, angle: number, spin: number) {
        super(drawable, location, angle);
        this.velX = velX;
        this.velY = velY;
        this.spin = spin;
    }
    
    update(timeModifier : number){
        this.location.x += this.velX * timeModifier;
        this.location.y += this.velY * timeModifier;
        this.angle += this.spin * timeModifier;
    }
    
    display(drawingContext : DrawContext){
        super.display(drawingContext);
    }
    
    protected angularThrust(thrust : number) {
        let velChange = Transforms.VectorToCartesian(this.angle, thrust);
        this.velX += velChange.x;
        this.velY += velChange.y;
    }
}

// TODO: Implement actual gravity
export class GravityGameObject extends MovingGameObject{
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
