import { StaticGameObject, MovingGameObject } from "../Common/GameObject";
import { IShip } from "./Ship";
import { Coordinate } from "../Common/Coordinate";
import { Polygon } from "../Common/DisplayObject";

export class LandingBasicShip extends MovingGameObject implements IShip {
    thrustPower : number;
    leftRightSpeed : number;
    leftRightSlowing : number;
    gravitationalPull : number;
    
    constructor(location : Coordinate){
        let points = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];
        var triangleShip = new Polygon(points);
        
        super(triangleShip, location, 0, 0, 0, 0);
        this.thrustPower = 16;
        this.leftRightSpeed = 1;
        this.leftRightSlowing = 0.2;
        this.gravitationalPull = 0.1;
    }
    
    update(timeModifier : number){
        super.update(timeModifier);
        
        this.vely += this.gravitationalPull;
    }
    
    thrust(lastTimeModifier : number){
        // TODO: Play thrust sfx
        this.angularThrust(this.thrustPower * lastTimeModifier)
    }
    
    crash(){
        console.log("Your crashed your ship while landing!");
    }
    
    moveLeft(){
        this.velx -= this.leftRightSpeed;
    }
    
    moveRight(){
        this.velx += this.leftRightSpeed;
    }
    
    notMovingOnX(){
        if(this.velx < 0)
            this.velx += this.leftRightSlowing;
        if(this.velx > 0)
            this.velx -= this.leftRightSlowing;
    }
}