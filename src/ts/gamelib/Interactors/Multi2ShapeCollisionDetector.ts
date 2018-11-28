
import { Coordinate, ICoordinate } from "../DataTypes/Coordinate";
import { Transforms } from "../Physics/Transforms";
import { IShapedLocation, IDetected } from "./ShapeCollisionDetector";

export function CollisionDetector(targets: IShapedLocation[], shapeModel: IShapedLocation): IDetected {
    for (let i1: number = targets.length - 1; i1 >= 0; i1--) {
        let target: IShapedLocation = targets[i1];
        for (let i2: number = shapeModel.shape.points.length - 1; i2 >= 0; i2--) {
            let point: ICoordinate = shapeModel.shape.points[i2];
            if (Transforms.hasPoint(target.shape.points, target.location,
                new Coordinate(shapeModel.location.x + shapeModel.shape.offset.x + point.x,
                    shapeModel.location.y + +shapeModel.shape.offset.y + point.y))) {
                return {indexShape:i1, indexHitter: i2};
            }
        }
    }
}