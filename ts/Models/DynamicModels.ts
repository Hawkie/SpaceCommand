import { ILocated, IMoving } from "ts/Data/PhysicsData";
import { IShape, ShapeData } from "ts/Data/ShapeData";
import { IGraphic, GraphicData } from "ts/Data/GraphicData";
//import { ILocatedMoving, ILocatedAngled, ILocatedAngledMoving, ILocatedMovingAngledRotatingData, ILocatedAngledMovingRotatingForwardAcc} from "ts/Data/PhysicsData";
import { TextData } from "ts/Models/TextModel";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator, Spinner } from "ts/Actors/Rotators";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";

export interface ILocatedModel {
    data: ILocated;
}

export class IShapedModel {
    data: ILocated;
    shape: IShape;
}

export class DynamicModel<TData> implements IActor {
    constructor(public data: TData, private actors: IActor[] = []) {
    }

    update(timeModifier: number) {
        this.actors.forEach(a => a.update(timeModifier));
    }
}

export class ShapedModel<TPhysics extends ILocated> implements IActor, ILocatedModel, IShapedModel {
    constructor(public data: TPhysics, public shape: IShape, private actors: IActor[] = []) {
    }

    update(timeModifier: number) {
        this.actors.forEach(a => a.update(timeModifier));
    }
}

export class DisplayModel<TPhysics extends ILocated> implements IActor, ILocatedModel {
    constructor(public data: TPhysics, public graphic: IGraphic, private actors: IActor[] = []) {
    }

    update(timeModifier: number) {
        this.actors.forEach(a => a.update(timeModifier));
    }
}


export class Model<TPhysics extends ILocated, TDraw> implements IActor, ILocatedModel {
    constructor(public data: TPhysics, public graphic: TDraw, private actors: IActor[] = []) {
    }

    update(timeModifier: number) {
        this.actors.forEach(a => a.update(timeModifier));
    }
}