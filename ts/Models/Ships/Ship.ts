import { ILocated, IMoving, IAngled, IRotating, IForwardAccelerator, IShapeLocatedMovingAccelerating, IShapeLocatedAngledMovingRotataingAccelerating } from "ts/Models/PolyModels"


export interface IShipModel {
    maxForwardForce: number;
    crashed: boolean;
}

export interface IRotatingShipModel {
    maxRotationalSpeed: number;
}

export interface ISpaceShipModel extends IShapeLocatedAngledMovingRotataingAccelerating, IShipModel, IRotatingShipModel { }

export interface ILandingShipModel extends IShapeLocatedMovingAccelerating, IShipModel { }