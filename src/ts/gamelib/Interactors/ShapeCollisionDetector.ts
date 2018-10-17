import { IInteractor } from "ts/gamelib/Interactors/Interactor";
import { ICoordinate } from "ts/gamelib/DataTypes/Coordinate";
import { Transforms } from "ts/gamelib/Physics/Transforms";
import { IShapedLocation } from "./CollisionDetector";
export class ShapeCollisionDetector implements IInteractor {
    constructor(private getModel: () => IShapedLocation,
    private points2: () => ICoordinate[],
    private hit: (i2: number, model2s: ICoordinate[]) => void,
    private searchFirstHitOnly: boolean = true) {
    }
    test(lastTestModifier: number): void {
        let found: boolean = false;
        let target: IShapedLocation = this.getModel();
        let hitters: ICoordinate[] = this.points2();
        for (let i2: number = hitters.length - 1; i2 >= 0; i2--) {
            let hitter: ICoordinate = hitters[i2];
            if (Transforms.hasPoint(target.shape.points, target.location, hitter)) {
                this.hit(i2, hitters);
                if (this.searchFirstHitOnly) {
                    found = true;
                    break;
                }
            }
        }
    }
}