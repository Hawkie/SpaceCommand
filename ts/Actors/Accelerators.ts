import { IVector, Vector } from "../Physics/Common";
import { Transforms } from "../Physics/Transforms";
import { IActor } from "./Actor";
import { IShapeAngledMovingForwardAcc, IMoving } from "../Models/PolyModels";


export class ForwardAccelerator implements IActor {

    constructor(private properties: IShapeAngledMovingForwardAcc) { }

    update(timeModifer: number) {
        let velChange = Transforms.VectorToCartesian(this.properties.angle, this.properties.forwardForce * timeModifer);
        this.properties.velX += velChange.x;
        this.properties.velY += velChange.y;
    }
}

export class VectorAccelerator implements IActor {

    constructor(private properties: IMoving, private externalForce: IVector) { }

    update(timeModifer: number) {
        let velChange = Transforms.VectorToCartesian(this.externalForce.angle, this.externalForce.length * timeModifer);
        this.properties.velX += velChange.x;
        this.properties.velY += velChange.y;
    }
}