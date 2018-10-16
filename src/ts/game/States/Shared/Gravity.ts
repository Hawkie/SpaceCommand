import { Vector } from "ts/gamelib/Data/Vector";
import Accelerator, { IAcceleratorInputs, IAcceleratorOutputs } from "ts/gamelib/Actors/Accelerator";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";

export interface IGravity {
    x: number;
    y: number;
    Vx: number;
    Vy: number;
    mass: number;
    gravityStrength: number;
}
// use Strategy pattern, pass in a set function of the target object
export function addGravity(getModel: ()=>IGravity, setOut: (out: IAcceleratorOutputs) => void, obj: SingleGameObject): void {
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
        var gravity: Accelerator = new Accelerator(getAcceleratorProps, setOut);
        obj.actors.push(gravity);
    }
}