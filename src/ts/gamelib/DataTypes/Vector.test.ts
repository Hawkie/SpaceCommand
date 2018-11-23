import { Transforms } from "../Physics/Transforms";
import { Coordinate } from "./Coordinate";

test("Access Map", () => {
    let c: Coordinate = Transforms.VectorToCartesian(45, 100);
    const EXPECTED: number = 70.71;
    console.log("Vector: " + c.x + "," + c.y);
    expect(c.x).toBeCloseTo(EXPECTED);
    expect(c.y).toBeCloseTo(-EXPECTED);
});