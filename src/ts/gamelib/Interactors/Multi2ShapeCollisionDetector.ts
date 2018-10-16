import { IInteractor } from "ts/gamelib/Interactors/Interactor";
import { Coordinate, ICoordinate } from "ts/gamelib/Data/Coordinate";
import { Transforms } from "ts/gamelib/Physics/Transforms";
import { IShapedLocation } from "./CollisionDetector";

export class Multi2ShapeCollisionDetector implements IInteractor {
    constructor(private model1s: () => IShapedLocation[],
    private sourceModel: () => IShapedLocation,
    private hit: (i1: number, i2: number) => void,
    private searchFirstHitOnly: boolean = true) {
    }
    test(lastTestModifier: number): void {
        let found: boolean = false;
        let targets: IShapedLocation[] = this.model1s();
        let shapeModel: IShapedLocation = this.sourceModel();
        for (let i1: number = targets.length - 1; i1 >= 0; i1--) {
            let target: IShapedLocation = targets[i1];
            for (let i2: number = shapeModel.shape.points.length - 1; i2 >= 0; i2--) {
                let point: ICoordinate = shapeModel.shape.points[i2];
                if (Transforms.hasPoint(target.shape.points, target.location,
                    new Coordinate(shapeModel.location.x + shapeModel.shape.offset.x + point.x,
                        shapeModel.location.y + +shapeModel.shape.offset.y + point.y))) {
                    this.hit(i1, i2);
                    if (this.searchFirstHitOnly) {
                        found = true;
                        break;
                    }
                }
            }
            // only hit one object (game speed optimisation)
            if (found) {
                break;
            }
        }
    }
}