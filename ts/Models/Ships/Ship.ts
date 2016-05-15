import { ILocated, IMoving, IAngled, IRotating, IForwardAccelerator, IShapeLocatedMovingAccelerating, IShapeLocatedAngledMovingRotataingAccelerating } from "ts/Models/PolyModels"


export interface IShipData {
    maxForwardForce: number;
    crashed: boolean;
}

export interface IRotatingShipData {
    maxRotationalSpeed: number;
}

export interface ISpaceShipData extends IShapeLocatedAngledMovingRotataingAccelerating, IShipData, IRotatingShipData { }

export interface ILandingShipData extends IShapeLocatedMovingAccelerating, IShipData { }