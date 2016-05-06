import { LocatedGO } from "../GameObjects/GameObject";
import { LocatedAngledMovingRotatingPoly }from "../GameObjects/LocatedAngledGO";
import { IShip } from "./Ship";
import { Coordinate } from "../Common/Coordinate";
import { Polygon } from "../DisplayObjects/DisplayObject";
import { Transforms } from "../Common/Transforms";

export class LandingBasicShip extends LocatedAngledMovingRotatingPoly implements IShip {
    thrustPower : number;
    leftRightSpeed : number;
    leftRightSlowing : number;
    gravitationalPull : number;
    
    constructor(location : Coordinate){
        let points = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];
        var triangleShip = new Polygon(points);
        super(triangleShip, location, 0, 0, 0, 0);
        this.thrustPower = 16;
        this.leftRightSpeed = 32;
        this.leftRightSlowing = 2;
        this.gravitationalPull = 0.1;
    }
    
    update(timeModifier : number){
        super.update(timeModifier);
        
        this.velY += this.gravitationalPull;
    }
    
    thrust(lastTimeModifier : number){
        // TODO: Play thrust sfx
        this.angularThrust(this.thrustPower * lastTimeModifier)
    }

    protected angularThrust(thrust: number) {
        let velChange = Transforms.VectorToCartesian(this.angle, thrust);
        this.velX += velChange.x;
        this.velY += velChange.y;
    }
    
    crash(){
        console.log("Your crashed your ship while landing!");
    }
    
    moveLeft(lastTimeModifier: number) {
        this.velX -= this.leftRightSpeed * lastTimeModifier;
    }

    moveRight(lastTimeModifier: number) {
        this.velX += this.leftRightSpeed * lastTimeModifier;
    }

    notMovingOnX(lastDrawModifier: number) {
        if (this.velX < 0) {
            this.velX += (this.leftRightSlowing * lastDrawModifier);
            if (this.velX >= 0) this.velX = 0;
        }
        else if (this.velX > 0) {
            this.velX -= (this.leftRightSlowing * lastDrawModifier);
            if (this.velX < 0) this.velX = 0;
        }
    }
}