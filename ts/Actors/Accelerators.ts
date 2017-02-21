import { IVector, Vector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { IActor } from "ts/Actors/Actor";
import { IMoving } from "ts/Data/PhysicsData";
import { IForces } from "ts/Data/PhysicsData";


export class Accelerator implements IActor {

    constructor(private properties: IMoving, private forces: Vector[]) { }

    update(timeModifer: number) {
        this.forces.forEach((f) => {
            let velChange = Transforms.VectorToCartesian(f.angle, f.length * timeModifer);
            this.properties.velX += velChange.x;
            this.properties.velY += velChange.y;
        });
    }
}
