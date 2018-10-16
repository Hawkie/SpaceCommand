import Accelerator, { IAcceleratorInputs, IAcceleratorOutputs } from "./Accelerator";
import { Vector } from "../Data/Vector";


test("accelerate", () => {
    var input: IAcceleratorInputs = {
        forces: [new Vector(180, 10)],
        mass: 10
    };
    var out: IAcceleratorOutputs = Accelerator.accelerate(1000, input);
    expect(out.dVx).toBeCloseTo(0);
    expect(out.dVy).toBe(10/input.mass*1000);
});