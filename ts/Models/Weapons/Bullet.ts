import { ICoordinate, IVector } from "../../Physics/Common"
import { Transforms } from "../../Physics/Transforms"
import { DrawContext } from "../../Common/DrawContext"
import { ParticleModel } from "../../Models/ParticleFieldModel";

export class BulletModel extends ParticleModel {
    
    constructor(location: ICoordinate, vector: IVector) {
        var cartesian = Transforms.VectorToCartesian(vector.angle, vector.length)
        super(location.x, location.y, cartesian.x, cartesian.y, 0);
    }
}

