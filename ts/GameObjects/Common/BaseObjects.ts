import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { IShapeLocated, IShapeLocatedMoving, IShapeLocatedAngledMovingRotataing, IShapeLocatedAngledMovingRotataingAccelerating } from "../Models/PolyModels";
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { TextView } from "ts/Views/TextView";
import { TextModel } from "ts/Models/TextModel";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator, Spinner } from "ts/Actors/Rotators";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";



export class StaticObject<ModelT extends IShapeLocated> extends GameObject<ModelT>{
    constructor(model: ModelT, actors: IActor[], views: IView[]) {
        super(model, actors, views);
    }
}

export class MovingObject<ModelT extends IShapeLocatedMoving> extends GameObject<ModelT> {
    constructor(model: ModelT, actors: IActor[], views: IView[]) {
        var mover: IActor = new Mover(model);
        actors.push(mover);
        super(model, actors, views);
    }
}

export class MovingSpinningObject<ModelT extends IShapeLocatedAngledMovingRotataing> extends GameObject<ModelT> {
    constructor(model: ModelT, actors: IActor[], views: IView[]) {
        var mover: IActor = new Mover(model);
        var spinner: IActor = new Spinner(model);
        var rotator = new PolyRotator(model);
        actors.push(mover, spinner, rotator);
        super(model, actors, views);
    }
}

export class MovingSpinningThrustingObject<ModelT extends IShapeLocatedAngledMovingRotataingAccelerating> extends GameObject<ModelT> {
    constructor(model: ModelT, actors: IActor[], views: IView[]) {
        var mover: IActor = new Mover(model);
        var spinner: IActor = new Spinner(model);
        var thrust = new ForwardAccelerator(model);
        var rotator = new PolyRotator(model);
        actors.push(mover, spinner, thrust, rotator);
        super(model, actors, views);
    }
}

// ---

export class TextObject extends GameObject<TextModel>{
    constructor(text: string, location: Coordinate, font: string, fontSize: number) {
        var textModel = new TextModel(text, location);
        var view: IView = new TextView(textModel, font, fontSize);
        super(textModel, [], [view]);
    }
}
