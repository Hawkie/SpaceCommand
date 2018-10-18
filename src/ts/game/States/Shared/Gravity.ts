import { Vector } from "ts/gamelib/DataTypes/Vector";
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
    let model: IGravity = getModel();
    if (model.gravityStrength !== 0) {
        let getAcceleratorProps: () => IAcceleratorInputs = () => {
            return {
                x: model.x,
                y: model.y,
                Vx: model.Vx,
                Vy: model.Vy,
                forces: [new Vector(180, model.gravityStrength)],
                mass: model.mass
            };
        };
        let gravity: Accelerator = new Accelerator(getAcceleratorProps, setOut);
        obj.actors.push(gravity);
    }
}