
import { ShapeCollisionDetector, IShapedLocation, ShapesCollisionDetector, IDetected } from "./ShapeCollisionDetector";
import { ICoordinate } from "../DataTypes/Coordinate";

// describe.each([[-0.1,0], [0,-0.1], [0,10.1], [10.1, 0], [10,10]])(
//     ".with(%d, %d)",
//     (x, y) => {
//     test("hasPointOutsideOffset 0, 0", () => {
//         const points: ICoordinate[] = [new Coordinate(0,0),
//             new Coordinate(0,10),
//             new Coordinate(10,10),
//             new Coordinate(10,0)];
//         const origin:Coordinate = new Coordinate(0,0);
//         const testPoint:Coordinate = new Coordinate(x,y);
//         expect(t.hasPoint(points, origin, testPoint)).toBe(false);
//     });
// },
// );
const squareOrigin: IShapedLocation = {
    location: { x: 0, y: 0},
    shape: {
        points: [{x: 0,y: 0},
        {x:0,y:10}, {x:10, y:10}, {x:10, y:0}],
        offset: { x: 0, y: 0}
    }
};

const square5050: IShapedLocation = {
    location: { x: 50, y: 50},
    shape: {
        points: [{x: 0,y: 0},
        {x:0,y:10}, {x:10, y:10}, {x:10, y:0}],
        offset: { x: 0, y: 0}
    }
};

test("ShapeCollision_WithNoCollision_ExpectsUndefined", ()=> {
    const items:ICoordinate[] = [{x:11,y:11}];
    const result: number = ShapeCollisionDetector(squareOrigin, items);
    expect(result).toBe(-1);
});

test("ShapeCollision_WithCollision_ExpectsNumber", ()=> {
    const items:ICoordinate[] = [{x:2,y:2}];
    const result: number = ShapeCollisionDetector(squareOrigin, items);
    expect(result).toBe(0);
});

test("ShapeCollision_WithCollision_ExpectsNumber", ()=> {
    const items:ICoordinate[] = [{x:11,y:11}, {x:2,y:2}];
    const result: number = ShapeCollisionDetector(squareOrigin, items);
    expect(result).toBe(1);
});

test("ShapeCollision_WithCollision_ExpectsNumber", ()=> {
    const items:ICoordinate[] = [{x:11,y:11}, {x:51,y:51}];
    const result: number = ShapeCollisionDetector(square5050, items);
    expect(result).toBe(1);
});

test("ShapesCollision_WithOutCollision_ExpectsUndefined", ()=> {
    const items:ICoordinate[] = [{x:11,y:11}, {x:33,y:33}];
    const result: IDetected = ShapesCollisionDetector([squareOrigin, square5050], items);
    expect(result).toBe(undefined);
});

test("ShapesCollision_WithCollision_ExpectsNumber", ()=> {
    const items:ICoordinate[] = [{x:2,y:2}, {x:11,y:11}, {x:51,y:51}];
    const result: IDetected = ShapesCollisionDetector([squareOrigin, square5050], items);
    expect(result.indexShape).toBe(0);
    expect(result.indexHitter).toBe(0);
});

test("ShapesCollision_WithCollision_ExpectsNumber", ()=> {
    const items:ICoordinate[] = [{x:-1,y:-1}, {x:11,y:11}, {x:51,y:51}];
    const result: IDetected = ShapesCollisionDetector([squareOrigin, square5050], items);
    expect(result.indexShape).toBe(1);
    expect(result.indexHitter).toBe(2);
});