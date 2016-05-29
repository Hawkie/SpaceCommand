import { DrawContext } from "ts/Common/DrawContext";
import { ILocated, IMoving, IAngled, IRotating, IForwardAccelerator } from "ts/Models/PolyModels";
import { IParticleFieldData } from "ts/Models/ParticleFieldModel";
import { IDrawable } from "ts/DisplayObjects/DisplayObject";
import { Coordinate } from "ts/Physics/Common";

export interface ILocatedAngled extends ILocated, IAngled { }

export interface ILocatedAngledMoving extends ILocated, IAngled, IMoving { }

export interface ILocatedMoving extends ILocated, IMoving { }

export interface IAngledRotating extends IAngled, IRotating { }

export interface IAngledMovingForwardAcc extends IAngled, IMoving, IForwardAccelerator { }

export interface ILocatedAngledMovingRotatingForwardAcc extends ILocated, IAngled, IMoving, IRotating, IForwardAccelerator { }

export interface ILocatedAngledMovingForwardAcc extends ILocated, IAngled, IMoving, IForwardAccelerator { }



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

export class Sprite {
}