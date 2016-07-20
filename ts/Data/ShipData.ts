
import { ILocated, IMoving, IAngled, IRotating, IForwardAccelerator, ILocatedAngledMovingRotatingForwardAcc, LocatedMovingAngledRotatingForwardAccData, LocatedAngledMovingRotatingAcceleratingData } from "ts/Data/PhysicsData"
import { IActor } from "ts/Actors/Actor";
import { Coordinate, Vector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";

export interface IShipData extends ILocatedAngledMovingRotatingForwardAcc {
    maxForwardForce: number;
    maxRotationalSpeed: number;
    crashed: boolean;
}

export class SpaceShipData extends LocatedMovingAngledRotatingForwardAccData {
    maxForwardForce: number;
    maxRotationalSpeed: number;
    crashed: boolean;

    constructor(location: Coordinate, velx: number, vely: number, angle: number, spin: number) {
        super(location, velx, vely, angle, spin, 0);
        this.maxForwardForce = 16;
        this.maxRotationalSpeed = 64;
        this.crashed = false;
    }
}


export class LandingShipData extends SpaceShipData {
    
    leftRightSpeed: number;
    leftRightSlowing: number;

    constructor(location: Coordinate) {
        super(location, 0, 0, 0, 0);
        this.leftRightSpeed = 32;
        this.leftRightSlowing = 2;
    }
}
