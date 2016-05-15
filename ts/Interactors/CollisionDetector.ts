import { IInteractor } from "ts/Interactors/Interactor";
import { Coordinate } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { IShapeLocated, ILocated } from "ts/Models/PolyModels";
import { IModel, DynamicModel } from "ts/Models/DynamicModels";


export class ObjectCollisionDetector implements IInteractor {
    constructor(private model1: IModel<IShapeLocated>, private model2: IModel<ILocated>, private hit: () => void){
    }

    test() {
        if (Transforms.hasPoint(this.model1.data.points, this.model1.data.location, this.model2.data.location))
            this.hit();
    }
}

export class Multi2ShapeCollisionDetector implements IInteractor {
    constructor(private model1s: () => IModel<IShapeLocated>[], private model2: IModel<IShapeLocated>, private hit: (i1: number, model1s: IModel<IShapeLocated>[], i2: number, shape: IModel<IShapeLocated>) => void, private searchFirstHitOnly: boolean = true) {
    }

    test() {
        let found = false;
        let targets = this.model1s();
        let shape = this.model2;
        for (let i1 = targets.length - 1; i1 >= 0; i1--) {
            let target = targets[i1];
            for (let i2 = shape.data.points.length - 1; i2 >= 0; i2--) {
                let point = shape.data.points[i2];
                if (Transforms.hasPoint(target.data.points, target.data.location, new Coordinate(shape.data.location.x + point.x, shape.data.location.y + point.y))) {
                    this.hit(i1, targets, i2, shape);
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

export class Multi2MultiCollisionDetector implements IInteractor {
    constructor(private model1s: () => IModel<IShapeLocated>[], private model2s: () => IModel<ILocated>[], private hit: (i1:number, model1s: IModel<IShapeLocated>[], i2:number, model2s: IModel<ILocated>[]) => void, private searchFirstHitOnly: boolean = true) {
    }

    test() {
        let found = false;
        let targets = this.model1s();
        let hitters = this.model2s();
        for (let i1 = targets.length - 1; i1 >= 0; i1--) {
            let target = targets[i1];
            for (let i2 = hitters.length - 1; i2 >= 0; i2--) {
                let hitter = hitters[i2];
                if (Transforms.hasPoint(target.data.points, target.data.location, hitter.data.location)) {
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