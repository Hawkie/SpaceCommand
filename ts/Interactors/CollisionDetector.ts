import { IInteractor } from "ts/Interactors/Interactor";
import { Coordinate } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { IShapeLocated, ILocated } from "ts/Models/PolyModels";


export class ObjectCollisionDetector<ArgT> implements IInteractor {
    constructor(private model1: IShapeLocated, private model2: ILocated, private hit: (ArgT) => void, private by: ArgT){
    }

    test() {
        if (Transforms.hasPoint(this.model1.points, this.model1.location, this.model2.location))
            this.hit(this.by);
    }
}

//export class MultiCollisionDetection implements IInteractor {
//    constructor(private models: IShapeLocated[], private model2: ILocated, private hit: (ILocated) => void) {
//    }

//    test() {
//        this.models.forEach(model1 => {
//            if (Transforms.hasPoint(model1.points, model1.location, this.model2.location))
//                this.hit(this.model2);
//        },
//            }
//    }
//}