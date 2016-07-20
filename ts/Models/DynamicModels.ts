import { ILocated, IMoving } from "ts/Data/PhysicsData";
import { IShape, ShapeData } from "ts/Data/ShapeData";
import { IGraphic, GraphicData } from "ts/Data/GraphicData";
import { ISprite, Sprite } from "ts/Data/SpriteData";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator, Spinner } from "ts/Actors/Rotators";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";

export interface ILocatedModel {
    data: ILocated;
}

export interface IModel<TData> {
    data: TData;
}

export interface IGraphicModel<TData1, TData2> {
    data: TData1;
    graphic: TData2;
}

export interface IShapedModel<TData1, TData2> {
    data: TData1;
    shape: TData2;
}

export class Model<TData> implements IModel<TData> {
    constructor(public data: TData) {
    }
}

export class GraphicModel<TPhysics extends ILocated, TDraw extends IGraphic> implements ILocatedModel, IModel<TPhysics> {
    constructor(public data: TPhysics, public graphic: TDraw) {
    }
}

export class SpriteModel<TPhysics extends ILocated, TDraw extends ISprite> implements ILocatedModel, IModel<TPhysics> {
    constructor(public data: TPhysics, public sprite: TDraw) {
    }
}

export class ShapedModel<TPhysics extends ILocated, TShape extends IShape> implements ILocatedModel, IModel<TPhysics>, IShapedModel<TPhysics, TShape> {
    constructor(public data: TPhysics, public shape: TShape) {
    }
}