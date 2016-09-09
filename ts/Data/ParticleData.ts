import { ICoordinate, Coordinate, IVector, Vector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { ILocatedMoving, LocatedMovingData, ILocatedMovingAngledRotating, LocatedMovingAngledRotatingData } from "ts/Data/PhysicsData";

export interface IParticleData extends ILocatedMovingAngledRotating {
    born: number;
    originX: number;
    originY: number;
}

export class ParticleData extends LocatedMovingAngledRotatingData implements IParticleData {
    private origin: Coordinate;
    constructor(locationx: number, locationy: number, velX: number, velY: number, angle:number, spin:number, private bornTime: number) {
        super(new Coordinate(locationx, locationy), velX, velY, angle, spin);
        this.origin = new Coordinate(locationx, locationy);
    }

    get born(): number {
        return this.bornTime;
    }
    get originX(): number {
        return this.origin.x;
    }
    get originY(): number {
        return this.origin.y;
    }
}

export class ParticleDataVectorConstructor extends ParticleData {

    constructor(location: ICoordinate, vector: IVector, bornTime: number) {
        var cartesian = Transforms.VectorToCartesian(vector.angle, vector.length)
        super(location.x, location.y, cartesian.x, cartesian.y, 0, 0, bornTime);
    }
}
