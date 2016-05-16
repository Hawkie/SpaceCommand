import { ILocated, IMoving, IAngled, IRotating, IForwardAccelerator, IShapeLocatedMovingAccelerating, IShapeLocatedAngledMovingRotataingAccelerating } from "ts/Models/PolyModels"
import { IActor } from "ts/Actors/Actor";

// Data Interfaces

export interface IShipData {
    maxForwardForce: number;
    crashed: boolean;
}

export interface IRotatingShipData {
    maxRotationalSpeed: number;
}

export interface ISpaceShipData extends IShapeLocatedAngledMovingRotataingAccelerating, IShipData, IRotatingShipData { }

export interface ILandingShipData extends IShapeLocatedMovingAccelerating, IShipData { }


// Model Interface

export interface IShipModel extends IActor {
    
    // methods
    left(timeModifier: number);
    right(timeModifier: number);
    thrust();
    noThrust();
    crash();
}

export interface IFiringShipModel extends IShipModel {
    shootPrimary();
}