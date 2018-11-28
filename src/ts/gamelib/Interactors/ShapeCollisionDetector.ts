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
    for (let i1: number = targets.length - 1; i1 >= 0; i1--) {
        const target:IShapedLocation = targets[i1];
        const i2: number = ShapeCollisionDetector(target, hitters);
        if (i2 !== -1) {
            return { indexShape: i1, indexHitter: i2 };
        }
    }
    return undefined;
}