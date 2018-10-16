import { move, IMoveOut } from "./Movers";


test("mover", () => {
    const Vx: number = 10;
    const Vy: number = 10;
    const TIMEMODIFIER: number = 1000;

    var result: IMoveOut = move(TIMEMODIFIER, Vx, Vy);
    expect(result.dx).toBeCloseTo(Vx*TIMEMODIFIER);
    expect(result.dy).toBeCloseTo(Vy*TIMEMODIFIER);
});