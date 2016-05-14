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

//export class MultiCollisionDetection<TArg> implements IInteractor {
//    constructor(private models: IShapeLocated[], private model2: ILocated, private hit: (arg:TArg, i1: number, models: IShapeLocated[]) => void, private by: TArg) {
//    }

//    test() {
//        for (let i = this.models.length - 1; i >= 0; i--) {
//            let model1 = this.models[i];
//            if (Transforms.hasPoint(model1.points, model1.location, this.model2.location)) {
//                this.hit(this.by, i, this.models);
//                break;
//            }
//        };
//    }
//}

export class MultiMultiCollisionDetection implements IInteractor {
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