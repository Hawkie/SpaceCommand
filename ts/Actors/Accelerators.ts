import { IVector, Vector } from "../Physics/Common";
import { IMoving, IAngledMovingForwardAcc } from "../GameObjects/GameObject";
import { Transforms } from "../Physics/Transforms";
import { IActor } from "./Actor";


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