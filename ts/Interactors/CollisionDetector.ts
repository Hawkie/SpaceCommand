import { IInteractor } from "ts/Interactors/Interactor";
import { Coordinate } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { IShapeLocated, ILocated } from "ts/Models/PolyModels";


export class ObjectCollisionDetector<TArg> implements IInteractor {
    constructor(private model1: IShapeLocated, private model2: ILocated, private hit: (TArg) => void, private by: TArg){
    }

    test() {
        if (Transforms.hasPoint(this.model1.points, this.model1.location, this.model2.location))
            this.hit(this.by);
    }
}

export class Multi2ShapeCollisionDetection implements IInteractor {
    constructor(private model1s: () => IShapeLocated[], private model2: IShapeLocated, private hit: (i1: number, model1s: IShapeLocated[], i2: number, shape: IShapeLocated) => void, private searchFirstHitOnly: boolean = true) {
    }

    test() {
        let found = false;
        let targets = this.model1s();
        let shape = this.model2;
        for (let i1 = targets.length - 1; i1 >= 0; i1--) {
            let target = targets[i1];
            for (let i2 = shape.points.length - 1; i2 >= 0; i2--) {
                let point = shape.points[i2];
                if (Transforms.hasPoint(target.points, target.location, new Coordinate(shape.location.x + point.x, shape.location.y + point.y))) {
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

export class Multi2MultiCollisionDetection implements IInteractor {
    constructor(private model1s: () => IShapeLocated[], private model2s: () => ILocated[], private hit: (i1:number, model1s: IShapeLocated[], i2:number, model2s: ILocated[]) => void, private searchFirstHitOnly: boolean = true) {
    }

    test() {
        let found = false;
        let targets = this.model1s();
        let hitters = this.model2s();
        for (let i1 = targets.length - 1; i1 >= 0; i1--) {
            let target = targets[i1];
            for (let i2 = hitters.length - 1; i2 >= 0; i2--) {
                let hitter = hitters[i2];
                if (Transforms.hasPoint(target.points, target.location, hitter.location)) {
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