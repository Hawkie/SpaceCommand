import { LocatedGO } from "../GameObjects/GameObject";
import { GravityGameObjectPoly }from "../GameObjects/LocatedAngledPoly";
import { IShip } from "./Ship";
import { Coordinate } from "../Common/Coordinate";
import { Polygon } from "../DisplayObjects/DisplayObject";
import { Transforms } from "../Common/Transforms";
import { ForwardAccelerator } from "../Actors/Accelerators";

export class LandingBasicShip extends GravityGameObjectPoly implements IShip {
    maxForwardForce: number;
    forwardForce : number;
    leftRightSpeed : number;
    leftRightSlowing : number;
    
    constructor(location : Coordinate){
        let points = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];
        var triangleShip = new Polygon(points);
        super(triangleShip, location, 0, 0, 0, 0, 10, 180);

        this.actors.push(new ForwardAccelerator(this));
        this.forwardForce = 0;
        this.maxForwardForce = 16;
        this.leftRightSpeed = 32;
        this.leftRightSlowing = 2;
    }
    
    thrust(){
        // TODO: Play thrust sfx
        this.forwardForce = this.maxForwardForce;
    }

    noThrust() {
        this.forwardForce = 0;
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