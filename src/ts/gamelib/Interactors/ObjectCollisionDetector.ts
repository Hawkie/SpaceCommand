import { IInteractor } from "ts/gamelib/Interactors/Interactor";
import { ICoordinate } from "ts/gamelib/DataTypes/Coordinate";
import { Transforms } from "ts/gamelib/Physics/Transforms";
import { IShapedLocation } from "./CollisionDetector";

export class ObjectCollisionDetector implements IInteractor {
    constructor(private getModel1: () => IShapedLocation,
        private point: ICoordinate, private hit: () => void) {
    }
    test(lastTestModifier: number): void {
        let model1: IShapedLocation = this.getModel1();
        if (Transforms.hasPoint(model1.shape.points,
            model1.location,
            this.point)) {
            this.hit();
        }
    }
}