import { UpdateAngle, ISpinnable } from "./Spinner";

test("spinTest", () => {
    const SPIN: number = 10; // degrees per second
    const TIMEMODIFIER: number = 0.1; // ms
    const object: ISpinnable = { angle: 4 };

    const result: ISpinnable  = UpdateAngle(TIMEMODIFIER, object, SPIN);
    expect(result.angle).toBeCloseTo(5);
});