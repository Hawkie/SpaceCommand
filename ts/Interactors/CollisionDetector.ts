import { IInteractor } from "ts/Interactors/Interactor";
import { Coordinate, ICoordinate } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { ILocated } from "ts/Data/PhysicsData";
import { IShape } from "ts/Data/ShapeData";
import { Model, IShapedModel, ShapedModel } from "ts/Models/DynamicModels";
import { SingleGameObject } from "ts/GameObjects/GameObject";


export class ObjectCollisionDetector implements IInteractor {
    constructor(private model1: IShapedModel<ILocated, IShape>, private point: ILocated, private hit: () => void){
    }

    test(lastTestModifier: number) {
        if (Transforms.hasPoint(this.model1.shape.points, this.model1.physics.location, this.point.location))
            this.hit();
    }
}

export class Multi2ShapeCollisionDetector<T> implements IInteractor {
    constructor(private model1s: () => IShapedModel<ILocated, IShape>[],
        private sourceModel: IShapedModel<ILocated, IShape>,
        private tag: T,
        private hit: (i1: number, targets: IShapedModel<ILocated, IShape>[], i2: number, sourceModel: IShapedModel<ILocated, IShape>, tag:T) => void,
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
                if (Transforms.hasPoint(target.shape.points, target.physics.location, new Coordinate(shapeModel.physics.location.x + shapeModel.shape.offset.x + point.x, shapeModel.physics.location.y + + shapeModel.shape.offset.y + point.y))) {
                    this.hit(i1, targets, i2, shapeModel, this.tag);
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

export class Multi2FieldCollisionDetector<T> implements IInteractor {
    constructor(private model1s: () => ShapedModel<ILocated, IShape>[],
    private points2: () => ICoordinate[],
    private tag:T,
    private hit: (i1:number, model1s: ShapedModel<ILocated, IShape>[],
        i2:number, model2s: ICoordinate[], tag: T) => void,
        private searchFirstHitOnly: boolean = true) {
    }

    test(lastTestModifier: number) {
        let found = false;
        let targets = this.model1s();
        let hitters = this.points2();
        for (let i1 = targets.length - 1; i1 >= 0; i1--) {
            let target = targets[i1];
            for (let i2 = hitters.length - 1; i2 >= 0; i2--) {
                let hitter = hitters[i2];
                if (Transforms.hasPoint(target.shape.points, target.physics.location, hitter)) {
                    this.hit(i1, targets, i2, hitters, this.tag);
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