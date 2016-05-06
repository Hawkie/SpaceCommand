import { IMovingVecAcc, IAngledMovingForwardAcc } from "../GameObjects/GameObject";
import { Transforms } from "../Common/Transforms";
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

    constructor(private properties: IMovingVecAcc) { }

    update(timeModifer: number) {
        let velChange = Transforms.VectorToCartesian(this.properties.vectorAngle, this.properties.vectorForce * timeModifer);
        this.properties.velX += velChange.x;
        this.properties.velY += velChange.y;
    }
}