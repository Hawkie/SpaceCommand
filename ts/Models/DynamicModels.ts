import { IShapeLocated, IShapeLocatedMoving, IShapeLocatedAngledMovingRotataing, IShapeLocatedAngledMovingRotataingAccelerating } from "../Models/PolyModels";
import { TextModel } from "ts/Models/TextModel";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator, Spinner } from "ts/Actors/Rotators";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";


export abstract class DynamicModel<ModelT> implements IActor {
    constructor(public model: ModelT, private actors: IActor[]) {
    }

    update(timeModifier: number) {
        this.actors.forEach(a => a.update(timeModifier));
    }
}


export class MovingObject<ModelT extends IShapeLocatedMoving> extends DynamicModel<ModelT> {
    constructor(model: ModelT, actors: IActor[]) {
        var mover: IActor = new Mover(model);
        actors.push(mover);
        super(model, actors);
    }
}

export class MovingSpinningObject<ModelT extends IShapeLocatedAngledMovingRotataing> extends DynamicModel<ModelT> {
    constructor(model: ModelT, actors: IActor[]) {
        var mover: IActor = new Mover(model);
        var spinner: IActor = new Spinner(model);
        var rotator = new PolyRotator(model);
        actors.push(mover, spinner, rotator);
        super(model, actors);
    }
}

export class MovingSpinningThrustingObject<ModelT extends IShapeLocatedAngledMovingRotataingAccelerating> extends DynamicModel<ModelT> {
    constructor(model: ModelT, actors: IActor[]) {
        var mover: IActor = new Mover(model);
        var spinner: IActor = new Spinner(model);
        var thrust = new ForwardAccelerator(model);
        var rotator = new PolyRotator(model);
        actors.push(mover, spinner, thrust, rotator);
        super(model, actors);
    }
}