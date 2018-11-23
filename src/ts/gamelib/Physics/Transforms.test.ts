import { Transforms as t } from "./Transforms";
import { Coordinate, ICoordinate } from "../DataTypes/Coordinate";
import { IVector } from "../DataTypes/Vector";

test("vectorToCartesian0", () => {
    let out: ICoordinate = t.VectorToCartesian(0, 10);
    expect(out.x).toBeCloseTo(0);
    expect(out.y).toBeCloseTo(-10);
});

test("vectorToCartesian360", () => {
    let out: ICoordinate = t.VectorToCartesian(360, 10);
    expect(out.x).toBeCloseTo(0, 14);
    expect(out.y).toBeCloseTo(-10);
});

test("vectorToCartesian180", () => {
    let out: ICoordinate = t.VectorToCartesian(180, 10);
    expect(out.x).toBeCloseTo(0, 14);
    expect(out.y).toBeCloseTo(10);
});

test("vectorToCartesian90", () => {
    let result: ICoordinate = t.VectorToCartesian(90, 10);
    expect(result.x).toBeCloseTo(10);
    expect(result.y).toBeCloseTo(0, 14);
});

test("vectorToCartesian270", () => {
    let result: ICoordinate = t.VectorToCartesian(270, 10);
    expect(result.x).toBeCloseTo(-10);
    expect(result.y).toBeCloseTo(0, 14);
});

test.each([[30, 10, 5, -8.66]])("VectorToCartesians", (angle, length, expX, expY) => {
    let result: ICoordinate = t.VectorToCartesian(angle, length);
    expect(result.x).toBeCloseTo(expX);
    expect(result.y).toBeCloseTo(expY);
});

test.each([[4, 3, 53.13, 5]])("CartesianToVector", (x, y, expAngle, expLength) => {
    let result: IVector = t.CartesianToVector(x, y);
    expect(result.angle).toBeCloseTo(expAngle, 2);
    expect(result.length).toBeCloseTo(expLength, 1);
});

test.each([[2,2,2,4,4]])("Scale", (x, y, scale, expX, expY) => {
    let result: ICoordinate[] = t.Scale([{x: x, y:y}], scale, scale);
    expect(result[0].x).toBeCloseTo(expX);
    expect(result[0].y).toBeCloseTo(expY);
});

test("hasPoint_WithOffset2020and2121_isInside", () => {
    const points: ICoordinate[] = [new Coordinate(0,0),
        new Coordinate(0,10),
        new Coordinate(10,10),
        new Coordinate(10,0)];
    const origin:Coordinate = new Coordinate(20,20);
    const testPoint:Coordinate = new Coordinate(21,21);
    expect(t.hasPoint(points, origin, testPoint)).toBe(true);
});

describe.each([[-0.1,0], [0,-0.1], [0,10.1], [10.1, 0], [10,10]])(
        ".with(%d, %d)",
        (x, y) => {
        test("hasPointOutsideOffset 0, 0", () => {
            const points: ICoordinate[] = [new Coordinate(0,0),
                new Coordinate(0,10),
                new Coordinate(10,10),
                new Coordinate(10,0)];
            const origin:Coordinate = new Coordinate(0,0);
            const testPoint:Coordinate = new Coordinate(x,y);
            expect(t.hasPoint(points, origin, testPoint)).toBe(false);
        });
    },
);

describe.each([[0,0],[0,9.9], [9.9,0], [9.9,9.9], [5, 5]])(
    ".with(%d, %d)",
    (x, y) => {
    test("hasPointInsideOffset 0, 0", () => {
        const points: ICoordinate[] = [new Coordinate(0,0),
            new Coordinate(0,10),
            new Coordinate(10,10),
            new Coordinate(10,0)];
        const origin:Coordinate = new Coordinate(0,0);
        const testPoint:Coordinate = new Coordinate(x,y);
        expect(t.hasPoint(points, origin, testPoint)).toBe(true);
        });
    },
);

describe.each([[1,1], [8.9,1], [1,8.9], [8.9,8.9], [6, 6]])(
    ".with(%d, %d)",
    (x, y) => {
    test("insideTrueWithOffset 1, 1", () => {
        const points: ICoordinate[] = [new Coordinate(0,0),
            new Coordinate(0,10),
            new Coordinate(10,10),
            new Coordinate(10,0)];
        const origin:Coordinate = new Coordinate(1,1);
        const testPoint:Coordinate = new Coordinate(x,y);
        expect(t.hasPoint(points, origin, testPoint)).toBe(true);
        });
    },
);