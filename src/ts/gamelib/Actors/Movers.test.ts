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