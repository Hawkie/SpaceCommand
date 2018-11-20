import { AccelerateWithForces, ISpeedable } from "./Accelerator";
import { Vector, IVector } from "../DataTypes/Vector";


test("accelerate", () => {
    const ONE_FORCE_DOWN: IVector[] = [new Vector(180, 10)];
    const MASS: number = 10;
    const TIMEMODIFIER: number = 1000;
    const object: ISpeedable = { Vx: 0, Vy:0 };

    const result: ISpeedable = AccelerateWithForces(TIMEMODIFIER, object, ONE_FORCE_DOWN, MASS);
    expect(result.Vx).toBeCloseTo(0);
    expect(result.Vy).toBeCloseTo(10/MASS*1000);
});

test("accelerateWithCurrentSpeed", () => {
    const ONE_FORCE_DOWN: IVector[] = [new Vector(180, 10)];
    const MASS: number = 10;
    const TIMEMODIFIER: number = 1000;
    const object: ISpeedable = { Vx: 10, Vy:10 };

    const result: ISpeedable = AccelerateWithForces(TIMEMODIFIER, object, ONE_FORCE_DOWN, MASS);
    expect(result.Vx).toBeCloseTo(10);
    expect(result.Vy).toBeCloseTo(1010);
});

test("accelerateWithTwoPerpendicularForces", () => {
    const LENGTH: number = 10;
    const TWOFORCES: IVector[] = [new Vector(180, LENGTH), new Vector(90, LENGTH)];
    const MASS: number = 10;
    const TIMEMODIFIER: number = 1000;
    const object: ISpeedable = { Vx: 0, Vy:0 };

    const result: ISpeedable = AccelerateWithForces(TIMEMODIFIER, object, TWOFORCES, MASS);
    expect(result.Vx).toBeCloseTo(10/MASS*TIMEMODIFIER);
    expect(result.Vx).toBeCloseTo(10/MASS*TIMEMODIFIER);
});