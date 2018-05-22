import { Vector } from "ts/gamelib/Data/Vector";
import Accelerator, { IAcceleratorInputs, IAcceleratorOutputs } from "ts/gamelib/Actors/Accelerator";
import { SingleGameObject } from "ts/gamelib/GameObjects/GameObject";


export interface IGravity {
    x: number;
    y: number;
    Vx: number;
    Vy: number;
    mass: number;
    gravityStrength: number;
}

export function addGravity(getModel: ()=>IGravity, obj: SingleGameObject): void {
    var model: IGravity = getModel();
    if (model.gravityStrength !== 0) {
        var getAcceleratorProps: () => IAcceleratorInputs = () => {
            return {
                x: model.x,
                y: model.y,
                Vx: model.Vx,
                Vy: model.Vy,
                forces: [new Vector(180, model.gravityStrength)],
                mass: model.mass
            };
        };
        var gravity: Accelerator = new Accelerator(getAcceleratorProps, (out: IAcceleratorOutputs) => {
            model.Vx += out.dVx;
            model.Vy += out.dVy;
        });
        obj.actors.push(gravity);
    }
}