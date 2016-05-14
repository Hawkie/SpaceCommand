import { ICoordinate, Coordinate, IVector, Vector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";

export interface IShape {
    points: Coordinate[];
}

export interface ILocated {
    location: Coordinate;
}

export interface IAngled {
    angle: number;
}

export interface IMoving {
    velX: number;
    velY: number;
}

export interface IRotating {
    spin: number;
}

export interface IForwardAccelerator {
    forwardForce: number;
}

export interface IGravity {
    gravityForce: Vector;
}

export interface IHittable {
    hit();
}

export interface ILocatedMoving extends ILocated, IMoving { }

export interface IShapeLocated extends IShape, ILocated { }

export interface IShapeAngled extends IShape, IAngled { }

export interface IShapeLocatedAngled extends IShape, ILocated, IAngled { }

export interface IShapeLocatedMoving extends IShape, ILocated, IMoving { }

export interface IShapeAngledRotating extends IShape, IAngled, IRotating { }

export interface IShapeAngledMovingForwardAcc extends IShape, IAngled, IMoving, IForwardAccelerator { }

export interface IShapeLocatedAngledMovingRotataing extends IShape, ILocated, IAngled, IMoving, IRotating { }

export interface IShapeLocatedAngledMovingRotataingAccelerating extends IShape, ILocated, IAngled, IMoving, IRotating, IForwardAccelerator { }

export interface IGravityObject extends IShape, ILocated, IAngled, IMoving, IRotating, IForwardAccelerator, IGravity { }

export class LocatedMovingModel implements ILocatedMoving {
    constructor(public location:Coordinate, public velX: number, public velY: number) { }
}

export class ShapeModel implements IShape {
    constructor(public points: Coordinate[]) { }
}

export class ShapeLocatedModel extends ShapeModel implements ILocated {
    constructor(points: Coordinate[], public location: Coordinate) {
        super(points);
    }
}

export class ShapeLocatedAngledModel extends ShapeLocatedModel implements IAngled {
    constructor(points: Coordinate[], location: Coordinate, public angle: number = 0) {
        super(points, location);
    }
}

export class ShapeLocatedAngledMovingModel extends ShapeLocatedAngledModel implements IMoving {
    constructor(points: Coordinate[], location: Coordinate, public velX: number = 0, public velY: number = 0, angle: number) {
        super(points, location, angle);
    }
}

export class ShapeLocatedAngledMovingRotatingModel extends ShapeLocatedAngledMovingModel implements IRotating {
    constructor(points: Coordinate[], location: Coordinate, velX: number = 0, velY: number = 0, angle: number = 0, public spin: number = 0) {
        super(points, location, velX, velY, angle);
    }
}

export class GravityObjectModel extends ShapeLocatedAngledMovingRotatingModel {
    constructor(points: Coordinate[], location: Coordinate, velx: number, vely: number, angle: number, spin: number, public gravityForce: Vector) {
        super(points, location, velx, vely, angle, spin);
    }
}
