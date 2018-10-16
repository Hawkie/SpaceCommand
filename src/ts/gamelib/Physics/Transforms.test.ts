import { Transforms } from "./Transforms";
import { Coordinate, ICoordinate } from "../Data/Coordinate";

test("vectorToCartesian0", () => {
    var out: ICoordinate = Transforms.VectorToCartesian(0, 10);
    expect(out.x).toBeCloseTo(0);
    expect(out.y).toBe(-10);
});

test("vectorToCartesian360", () => {
    var out: ICoordinate = Transforms.VectorToCartesian(360, 10);
    expect(out.x).toBeCloseTo(0);
    expect(out.y).toBeCloseTo(-10);
});

test("vectorToCartesian180", () => {
    var out: ICoordinate = Transforms.VectorToCartesian(180, 10);
    expect(out.x).toBeCloseTo(0);
    expect(out.y).toBe(10);
});

test("vectorToCartesian90", () => {
    var out: ICoordinate = Transforms.VectorToCartesian(90, 10);
    expect(out.x).toBe(10);
    expect(out.y).toBeCloseTo(0);
});

test("vectorToCartesian270", () => {
    var out: ICoordinate = Transforms.VectorToCartesian(270, 10);
    expect(out.x).toBe(-10);
    expect(out.y).toBeCloseTo(0);
});

test("vectorToCartesian30", () => {
    var out: ICoordinate = Transforms.VectorToCartesian(30, 10);
    expect(out.x).toBeCloseTo(5);
    expect(out.y).toBeCloseTo(-8.66);
});