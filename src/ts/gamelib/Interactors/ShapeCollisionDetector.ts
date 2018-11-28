import { ICoordinate } from "../../../ts/gamelib/DataTypes/Coordinate";
import { Transforms } from "../../../ts/gamelib/Physics/Transforms";
import { IShape } from "../DataTypes/Shape";

export interface IShapedLocation {
    location: ICoordinate;
    shape: IShape;
}

export function ShapeCollisionDetector(target: IShapedLocation, hitters: ICoordinate[]): number {
    return hitters.findIndex(h => Transforms.hasPoint(target.shape.points, target.location, h));
}

export interface IDetected {
    indexShape: number;
    indexHitter: number;
}

export function ShapesCollisionDetector(targets: IShapedLocation[],
     hitters: ICoordinate[]): IDetected {
    let i2: number = -1;
    const i1: number = targets.findIndex(t => {
        i2 = ShapeCollisionDetector(t, hitters);
        return i2 !== -1;
    });
    if (i1 !== -1) {
        return { indexShape: i1, indexHitter: i2 };
    }
    return undefined;
}