import { ILocated, IMoving } from "ts/Data/PhysicsData";
import { IShape, ShapeData } from "ts/Data/ShapeData";
import { IGraphic, GraphicData } from "ts/Data/GraphicData";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator, Spinner } from "ts/Actors/Rotators";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";

export interface ILocatedModel {
    data: ILocated;
}

export interface IModel<TData> extends IActor {
    data: TData;
}

export interface IGraphicModel<TData1, TData2> extends IActor {
    data: TData1;
    graphic: TData2;
}

export interface IShapedModel<TData1, TData2> extends IActor {
    data: TData1;
    shape: TData2;
}

export class DynamicModel<TData> implements IActor, IModel<TData> {
    constructor(public data: TData, private actors: IActor[] = []) {
    }

    update(timeModifier: number) {
        this.actors.forEach(a => a.update(timeModifier));
    }
}

export class GraphicModel<TPhysics extends ILocated, TDraw extends IGraphic> implements IActor, ILocatedModel, IModel<TPhysics> {
    constructor(public data: TPhysics, public graphic: TDraw, private actors: IActor[] = []) {
    }

    update(timeModifier: number) {
        this.actors.forEach(a => a.update(timeModifier));
    }
}

export class ShapedModel<TPhysics extends ILocated, TShape extends IShape> implements IActor, ILocatedModel, IModel<TPhysics>, IShapedModel<TPhysics, TShape> {
    constructor(public data: TPhysics, public shape: TShape, private actors: IActor[] = []) {
    }

    update(timeModifier: number) {
        this.actors.forEach(a => a.update(timeModifier));
    }
}