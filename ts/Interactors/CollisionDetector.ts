import { IInteractor } from "ts/Interactors/Interactor";
import { Coordinate } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { ILocated } from "ts/Data/PhysicsData";
import { IShape } from "ts/Data/ShapeData";
import { Model, IShapedModel, ShapedModel } from "ts/Models/DynamicModels";
import { GameObject } from "ts/GameObjects/GameObject";


export class ObjectCollisionDetector implements IInteractor {
    constructor(private model1: IShapedModel<ILocated, IShape>, private point: ILocated, private hit: () => void){
    }

    test(lastTestModifier: number) {
        if (Transforms.hasPoint(this.model1.shape.points, this.model1.data.location, this.point.location))
            this.hit();
    }
}

export class Multi2ShapeCollisionDetector implements IInteractor {
    constructor(private model1s: () => IShapedModel<ILocated, IShape>[],
        private sourceModel: IShapedModel<ILocated, IShape>,
        private hit: (i1: number, targets: IShapedModel<ILocated, IShape>[], i2: number, sourceModel: IShapedModel<ILocated, IShape>) => void,
        private searchFirstHitOnly: boolean = true) {
    }

    test(lastTestModifier: number) {
        let found = false;
        let targets = this.model1s();
        let shapeModel = this.sourceModel;
        for (let i1 = targets.length - 1; i1 >= 0; i1--) {
            let target = targets[i1];
            for (let i2 = shapeModel.shape.points.length - 1; i2 >= 0; i2--) {
                let point = shapeModel.shape.points[i2];
                if (Transforms.hasPoint(target.shape.points, target.data.location, new Coordinate(shapeModel.data.location.x + point.x, shapeModel.data.location.y + point.y))) {
                    this.hit(i1, targets, i2, shapeModel);
                    if (this.searchFirstHitOnly) {
                        found = true;
                        break;
                    }
                }
            }
            // only hit one object (game speed optimisation)
            if (found)
                break;
        }
    }
}

export class Multi2FieldCollisionDetector implements IInteractor {
    constructor(private model1s: () => ShapedModel<ILocated, IShape>[], private model2s: () => GameObject<ILocated>[], private hit: (i1:number, model1s: ShapedModel<ILocated, IShape>[], i2:number, model2s: GameObject<ILocated>[]) => void, private searchFirstHitOnly: boolean = true) {
    }

    test(lastTestModifier: number) {
        let found = false;
        let targets = this.model1s();
        let hitters = this.model2s();
        for (let i1 = targets.length - 1; i1 >= 0; i1--) {
            let target = targets[i1];
            for (let i2 = hitters.length - 1; i2 >= 0; i2--) {
                let hitter = hitters[i2];
                if (Transforms.hasPoint(target.shape.points, target.data.location, hitter.model.location)) {
                    this.hit(i1, targets, i2, hitters);
                    if (this.searchFirstHitOnly) {
                        found = true;
                        break;
                    }
                }
            }
            // only hit one object (game speed optimisation)
            if (found)
                break;
        }
    }
}