import { Coordinate, Vector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { ForwardAccelerator } from "ts/Actors/Accelerators";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { PolyView, IView } from "ts/Views/PolyViews";
import { GravityObjectModel } from "ts/Models/PolyModels";

export class LandingBasicShipModel extends GravityObjectModel {
    maxForwardForce: number;
    forwardForce : number;
    leftRightSpeed : number;
    leftRightSlowing : number;
    
    constructor(points: Coordinate[], location : Coordinate){
        var gravityForce = new Vector(180, 10);
        super(points, location, 0, 0, 0, 0, gravityForce);

        this.forwardForce = 0;
        this.maxForwardForce = 16;
        this.leftRightSpeed = 32;
        this.leftRightSlowing = 2;
    }
    
    thrustVelX(): number {
        let velchange = Transforms.VectorToCartesian(this.angle, this.forwardForce);
        return -velchange.x + this.velX + (Math.random() * 5);
    }

    thrustVelY(): number {
        let velchange = Transforms.VectorToCartesian(this.angle, this.forwardForce);
        return -velchange.y + this.velY + (Math.random() * 5);
    }

   
}