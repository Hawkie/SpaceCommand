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

export interface IForces {
    forces: Vector[];
    mass: number;
}

export interface IHittable {
    hit(): void;
}

export interface IAngledMovingForces extends IAngled, IMoving, IForces { }

export interface ILocatedAngled extends ILocated, IAngled { }

export interface ILocatedAngledMoving extends ILocated, IAngled, IMoving { }

export interface ILocatedAngledMovingForces extends ILocated, IAngled, IMoving, IForces { }

export interface ILocatedMoving extends ILocated, IMoving { }

export interface IAngledRotating extends IAngled, IRotating { }

export interface ILocatedMovingAngledRotating extends ILocated, IMoving, IAngled, IRotating { }

export interface ILocatedAngledMovingRotatingForces extends ILocated, IAngled, IMoving, IRotating, IForces { }


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

export class LocatedMovingAngledRotatingForces extends LocatedMovingAngledRotatingData implements IForces {
    public forces: Vector[];
    constructor(location: Coordinate, velX: number, velY: number, angle: number, public spin: number, public mass:number) {
        super(location, velX, velY, angle, spin);
        this.forces = [];
    }
}