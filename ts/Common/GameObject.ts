import { DrawContext } from "./DrawContext";
import { IDisplayObject } from "./DisplayObject";
import { Coordinate } from "./Coordinate";
import { Transforms } from "./Transforms"

export interface IGameObject
{
    update(timeModifier : number);
    display(drawingContext : DrawContext);
}

export interface IHittable
{
    hitTest(testPoint : Coordinate);
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
    velx : number;
    vely : number;
    angle : number;
    spin : number;
    constructor(displayObject : IDisplayObject, location : Coordinate, velx: number, vely: number, angle: number, spin: number) {
        super(displayObject, location);
        this.velx = velx;
        this.vely = vely;
        this.angle = angle;
        this.spin = spin;
    }
    
    update(timeModifier : number){
        this.location.x += this.velx * timeModifier;
        this.location.y += this.vely * timeModifier;
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
        let velchange = Transforms.toVector(this.angle, thrust);
        this.velx += velchange.x;
        this.vely += velchange.y;
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
