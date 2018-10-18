import { ISpinnerInputs, spin, ISpinnerOutputs } from "./Spinner";

test("spinTest", () => {
    const SPIN: number = 10;
    const TIMEMODIFIER: number = 1000;

    let result: ISpinnerOutputs = spin(TIMEMODIFIER, SPIN);
    expect(result.dAngle).toBeCloseTo(10000);
});