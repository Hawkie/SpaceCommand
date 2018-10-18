import { move, IMoveOut } from "./Movers";


test("mover", () => {
    const Vx: number = 5;
    const Vy: number = 10;
    const TIMEMODIFIER: number = 1000;

    let result: IMoveOut = move(TIMEMODIFIER, Vx, Vy);
    expect(result.dx).toBeCloseTo(5000);
    expect(result.dy).toBeCloseTo(10000);
});