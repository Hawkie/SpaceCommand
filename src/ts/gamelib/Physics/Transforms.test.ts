import { Transforms } from "./Transforms";
import { Coordinate, ICoordinate } from "../Data/Coordinate";
import { IVector } from "../Data/Vector";

test("vectorToCartesian0", () => {
    var out: ICoordinate = Transforms.VectorToCartesian(0, 10);
    expect(out.x).toBeCloseTo(0);
    expect(out.y).toBeCloseTo(-10);
});

test("vectorToCartesian360", () => {
    var out: ICoordinate = Transforms.VectorToCartesian(360, 10);
    expect(out.x).toBeCloseTo(0, 14);
    expect(out.y).toBeCloseTo(-10);
});

test("vectorToCartesian180", () => {
    var out: ICoordinate = Transforms.VectorToCartesian(180, 10);
    expect(out.x).toBeCloseTo(0, 14);
    expect(out.y).toBeCloseTo(10);
});

test("vectorToCartesian90", () => {
    var out: ICoordinate = Transforms.VectorToCartesian(90, 10);
    expect(out.x).toBeCloseTo(10);
    expect(out.y).toBeCloseTo(0, 14);
});

test("vectorToCartesian270", () => {
    var out: ICoordinate = Transforms.VectorToCartesian(270, 10);
    expect(out.x).toBeCloseTo(-10);
    expect(out.y).toBeCloseTo(0, 14);
});

test.each([[30, 10, 5, -8.66]])("VectorToCartesians", (angle, length, expX, expY) => {
    var out: ICoordinate = Transforms.VectorToCartesian(angle, length);
    expect(out.x).toBeCloseTo(expX);
    expect(out.y).toBeCloseTo(expY);
});

test.each([[4, 3, 53.13, 5]])("CartesianToVector", (x, y, expAngle, expLength) => {
    var out: IVector = Transforms.CartesianToVector(x, y);
    expect(out.angle).toBeCloseTo(expAngle, 2);
    expect(out.length).toBeCloseTo(expLength, 1);
});

test.each([[2,2,2,4,4]])("Scale", (x, y, scale, expX, expY) => {
    var result: ICoordinate[] = Transforms.Scale([{x: x, y:y}], scale, scale);
    expect(result[0].x).toBeCloseTo(expX);
    expect(result[0].y).toBeCloseTo(expY);
});