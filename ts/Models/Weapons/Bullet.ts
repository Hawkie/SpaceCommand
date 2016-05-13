import { ICoordinate, IVector } from "ts/Physics/Common"
import { Transforms } from "ts/Physics/Transforms"
import { ParticleModel } from "ts/Models/ParticleFieldModel";

export class BulletModel extends ParticleModel {
    
    constructor(location: ICoordinate, vector: IVector) {
        var cartesian = Transforms.VectorToCartesian(vector.angle, vector.length)
        super(location.x, location.y, cartesian.x, cartesian.y, 0);
    }
}

