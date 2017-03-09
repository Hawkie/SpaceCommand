
import { ILocated, IMoving, IAngled, IRotating, IForces, ILocatedAngledMovingRotatingForces, LocatedMovingAngledRotatingForces } from "ts/Data/PhysicsData"
import { IActor } from "ts/Actors/Actor";
import { Coordinate, Vector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";

export interface IShipData extends ILocatedAngledMovingRotatingForces {
    maxForwardForce: number;
    maxRotationalSpeed: number;
    crashed: boolean;
}

export class SpaceShipData extends LocatedMovingAngledRotatingForces {
    maxForwardForce: number;
    maxRotationalSpeed: number;
    crashed: boolean;

    constructor(location: Coordinate, velx: number, vely: number, angle: number, spin: number, mass:number) {
        super(location, velx, vely, angle, spin, mass);
        this.maxForwardForce = 16;
        this.maxRotationalSpeed = 64;
        this.crashed = false;
    }
}


export class LandingShipData extends SpaceShipData {
    
    leftRightSpeed: number;
    leftRightSlowing: number;

    constructor(location: Coordinate, mass:number) {
        super(location, 0, 0, 0, 0, mass);
        this.leftRightSpeed = 32;
        this.leftRightSlowing = 2;
    }
}
