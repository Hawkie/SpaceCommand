import { Coordinate } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { ShapeLocatedAngledMovingRotatingData, IHittable  } from "ts/Models/PolyModels";
import { ShapeMovingSpinningModel } from "ts/Models/DynamicModels";



export class AsteroidData extends ShapeLocatedAngledMovingRotatingData implements IHittable {
    constructor(collisionPoly: Coordinate[], location: Coordinate, velx: number, vely: number, angle: number, spin: number) {
        super(collisionPoly, location, velx, vely, angle, spin);
    }

    hit() {
        this.velX += 2;
        this.spin += 1;
    }
}

export class AsteroidModel extends ShapeMovingSpinningModel<AsteroidData> {
}