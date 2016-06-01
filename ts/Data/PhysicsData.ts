import { Coordinate, Vector } from "ts/Physics/Common";


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

export interface IAngledMovingForwardAcc extends IAngled, IMoving, IForwardAccelerator { }

export interface ILocatedAngled extends ILocated, IAngled { }

export interface ILocatedAngledMoving extends ILocated, IAngled, IMoving { }

export interface ILocatedAngledMovingForwardAcc extends ILocated, IAngled, IMoving, IForwardAccelerator { }

export interface ILocatedMoving extends ILocated, IMoving { }

export interface IAngledRotating extends IAngled, IRotating { }

export interface ILocatedMovingAngledRotatingData extends ILocated, IMoving, IAngled, IRotating { }

export interface ILocatedAngledMovingRotatingForwardAcc extends ILocated, IAngled, IMoving, IRotating, IForwardAccelerator { }

export interface IGravityObject extends ILocated, IAngled, IMoving, IRotating, IForwardAccelerator, IGravity { }

export class LocatedData implements ILocated {
    constructor(public location: Coordinate) { }
}

export class LocatedMovingData extends LocatedData implements IMoving {
    constructor(location: Coordinate, public velX: number, public velY: number) {
        super(location);
    }
}

export class LocatedMovingAngledData extends LocatedMovingData implements IAngled {
    constructor(location: Coordinate, velX: number, velY: number, public angle:number) {
        super(location, velX, velY);
    }
}

export class LocatedMovingAngledRotatingData extends LocatedMovingAngledData implements IRotating {
    constructor(location: Coordinate, velX: number, velY: number, angle: number, public spin:number) {
        super(location, velX, velY, angle);
    }
}

export class LocatedMovingAngledRotatingForwardAccData extends LocatedMovingAngledRotatingData implements IForwardAccelerator {
    constructor(location: Coordinate, velX: number, velY: number, angle: number, public spin: number, public forwardForce:number ) {
        super(location, velX, velY, angle, spin);
    }
}

export class LocatedAngledMovingRotatingAcceleratingData extends LocatedMovingAngledRotatingForwardAccData {
    constructor(location: Coordinate, velx: number, vely: number, angle: number, spin: number, public gravityForce: Vector) {
        super(location, velx, vely, angle, spin, 0);
    }
}
