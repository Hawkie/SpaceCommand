import { IMoveable, MoveWithVelocity } from "./Movers";


test("mover", () => {
    let m: IMoveable = {
        x: 10,
        y: 20,
    };
    const Vx: number = 5;
    const Vy: number = 10;
    const TIMEMODIFIER: number = 100;

    let result: IMoveable = MoveWithVelocity(TIMEMODIFIER, m, Vx, Vy);
    expect(result.x).toBeCloseTo(510);
    expect(result.y).toBeCloseTo(1020);
});

test("reducerTest", () => {
    const immutable:ReadonlyArray<string> = ["alice","bob"];
    let mutable:string[] = immutable.map(b => b);
    mutable.splice(1,1);
    expect(immutable.length).toBe(2);
    expect(mutable.length).toBe(1);
});