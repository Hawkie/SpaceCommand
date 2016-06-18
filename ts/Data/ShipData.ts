
import { ILocated, IMoving, IAngled, IRotating, IForwardAccelerator, ILocatedAngledMovingRotatingForwardAcc, LocatedMovingAngledRotatingForwardAccData, LocatedAngledMovingRotatingAcceleratingData } from "ts/Data/PhysicsData"
import { IActor } from "ts/Actors/Actor";
import { Coordinate, Vector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";

export interface IShipData {
    maxForwardForce: number;
    crashed: boolean;
}

export interface IRotatingShipData {
    maxRotationalSpeed: number;
}

export interface ISpaceShipData extends ILocatedAngledMovingRotatingForwardAcc, IShipData, IRotatingShipData { }



export class BasicShipData extends LocatedMovingAngledRotatingForwardAccData implements IShipData {
    maxForwardForce: number;
    maxRotationalSpeed: number;
    crashed: boolean;

    constructor(location: Coordinate, velx: number, vely: number, angle: number, spin: number) {
        super(location, velx, vely, angle, spin, 0);
        this.maxForwardForce = 16;
        this.maxRotationalSpeed = 64;
        this.crashed = false;
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


export class LandingBasicShipData extends LocatedAngledMovingRotatingAcceleratingData {
    maxForwardForce: number;
    forwardForce: number;
    leftRightSpeed: number;
    leftRightSlowing: number;

    constructor(location: Coordinate) {
        var gravityForce = new Vector(180, 10);
        super(location, 0, 0, 0, 0, gravityForce);

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
