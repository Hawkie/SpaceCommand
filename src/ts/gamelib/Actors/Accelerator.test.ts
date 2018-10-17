import { IAcceleratorOutputs, accelerate } from "./Accelerator";
import { Vector, IVector } from "../DataTypes/Vector";


test("accelerate", () => {
    const ONE_FORCE_DOWN: IVector[] = [new Vector(180, 10)];
    const MASS: number = 10;

    const result: IAcceleratorOutputs = accelerate(1000, ONE_FORCE_DOWN, MASS);
    expect(result.dVx).toBeCloseTo(0);
    expect(result.dVy).toBeCloseTo(10/MASS*1000);
});

test("accelerateWithTwoForces", () => {
    const LENGTH: number = 10;
    const FORCES: IVector[] = [new Vector(180, LENGTH), new Vector(90, LENGTH)];
    const MASS: number = 10;
    const TIMEMODIFIER: number = 1000;

    var result: IAcceleratorOutputs = accelerate(TIMEMODIFIER, FORCES, MASS);
    expect(result.dVx).toBeCloseTo(10/MASS*TIMEMODIFIER);
    expect(result.dVy).toBeCloseTo(10/MASS*TIMEMODIFIER);
});