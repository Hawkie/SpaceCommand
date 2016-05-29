import { IVector, Vector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { IActor } from "ts/Actors/Actor";
import { IMoving } from "ts/Models/PolyModels";
import { IAngledMovingForwardAcc } from "ts/Data/PhysicsData";


export class ForwardAccelerator implements IActor {

    constructor(private properties: IAngledMovingForwardAcc) { }

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