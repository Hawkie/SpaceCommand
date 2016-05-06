import { IForwardAccelerator, IAngledMovingForwardAcc } from "../GameObjects/GameObject";
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