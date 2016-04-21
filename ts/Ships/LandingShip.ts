import { StaticGameObject, MovingGameObject } from "../Common/GameObject";
import { Coordinate } from "../Common/Coordinate";
import { Polygon } from "../Common/DisplayObject";

export interface ILandableShip
{
    //landingPad : StaticGameObject;
    thrust(lastTimeModifier : number);
}

export class LandingBasicShip extends MovingGameObject implements ILandableShip {
    thrustPower : number;
    leftRightSpeed : number;
    leftRightSlowing : number;
    gravitationalPull : number;
    windSpeed : number;
    windChangeChance : number;
    
    constructor(location : Coordinate){
        let points = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];
        var triangleShip = new Polygon(points);
        
        super(triangleShip, location, 0, 0, 0, 0);
        this.thrustPower = 16;
        this.leftRightSpeed = 16;
        this.leftRightSlowing = 0.2;
        this.gravitationalPull = 0.1;
        this.windSpeed = 0.25;
        this.windChangeChance = 100;
    }
    
    update(timeModifier : number){
        super.update(timeModifier);
        
        this.vely += this.gravitationalPull;
    }
    
    wind(blowingRight : boolean){
        if(blowingRight){
            this.velx += this.windSpeed;
        }else{
            this.velx -= this.windSpeed;
        }
    }
    
    thrust(lastTimeModifier : number){
        // TODO: Play thrust sfx
        this.angularThrust(this.thrustPower * lastTimeModifier)
    }
    
    moveLeft(){
        this.velx = -this.leftRightSpeed;
    }
    
    moveRight(){
        this.velx = this.leftRightSpeed;
    }
    
    notMovingOnX(){
        if(this.velx < 0)
            this.velx += this.leftRightSlowing;
        if(this.velx > 0)
            this.velx -= this.leftRightSlowing;
    }
}