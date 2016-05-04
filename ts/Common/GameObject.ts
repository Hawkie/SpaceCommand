import { DrawContext } from "./DrawContext";
import { IDisplayObject } from "../DisplayObjects/DisplayObject";
import { Coordinate } from "./Coordinate";
import { Transforms } from "./Transforms";

export interface IGameObject
{
    update(timeModifier : number);
    display(drawingContext : DrawContext);
}

export class StaticGameObject implements IGameObject{
    
    displayObject : IDisplayObject;
    location : Coordinate;
    constructor(displayObject : IDisplayObject, location : Coordinate){
        this.displayObject = displayObject;
        this.location = location;
    }
    
    update(timeModifier : number){}
    
    display(drawingContext : DrawContext){
        this.displayObject.draw(this.location, drawingContext);
    }
}

export class MovingGameObject extends StaticGameObject{
    velX : number;
    velY : number;
    angle : number;
    spin: number;

    constructor(displayObject : IDisplayObject, location : Coordinate, velX: number, velY: number, angle: number, spin: number) {
        super(displayObject, location);
        this.velX = velX;
        this.velY = velY;
        this.angle = angle;
        this.spin = spin;
    }
    
    update(timeModifier : number){
        this.location.x += this.velX * timeModifier;
        this.location.y += this.velY * timeModifier;
        this.angle += this.spin * timeModifier;
    }
    
    display(drawingContext : DrawContext){
        drawingContext.translate(this.location.x, this.location.y);
        drawingContext.rotate(this.angle);
        drawingContext.translate(-this.location.x, -this.location.y);
        super.display(drawingContext);
        drawingContext.translate(this.location.x, this.location.y);
        drawingContext.rotate(-this.angle);
        drawingContext.translate(-this.location.x, -this.location.y);
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
    
    constructor(displayObject : IDisplayObject, location : Coordinate, velx: number, vely: number, angle: number, spin: number, mass : number, gravitationalPull : number){
        super(displayObject, location, velx, vely, angle, spin);
        this.mass = mass;
        this.gravitationalPull = gravitationalPull;
        this.weight = mass * gravitationalPull;
    }
    
    update(timeModifier : number){
        super.update(timeModifier);
        
        this.location.y -= this.weight * timeModifier;
    }
}
