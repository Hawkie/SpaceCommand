import { IInteractor } from "../Interactors/Interactor";
import { ICoordinate } from "../DataTypes/Coordinate";
import { Transforms } from "../Physics/Transforms";
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