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


export interface IPhysical<TPhysics extends ILocated> {
    physics: TPhysics;
}

export interface IShaped<TShape extends IShape> {
    shape: TShape;
}

export interface IGamed<TObject> {
    object: TObject;
}

export interface ISprited<TSprite extends ISprite> {
    sprite: TSprite;
}

export interface IGraphical<TGraphic extends IGraphic> {
    graphic: TGraphic;
}

export interface IShapedModel<TPhysics extends ILocated, TShape extends IShape> extends IPhysical<TPhysics>, IShaped<TShape> { }


export interface IGPSModel<TGame, TPhysics extends ILocated, TShape extends IShape > extends IGamed<TGame>, IPhysical < TPhysics >, IShaped < TShape > {}


export class Model<TPhysics extends ILocated> implements IPhysical<TPhysics> {
    constructor(
        public physics: TPhysics) {
    }
}

export class GraphicModel<TPhysics extends ILocated,
    TGraphic extends IGraphic>
    implements IPhysical<TPhysics>, IGraphical<TGraphic> {
    constructor(
        public physics: TPhysics,
        public graphic: TGraphic) {
    }
}

export class SpriteModel<TPhysics extends ILocated,
    TSprite extends ISprite>
    implements IPhysical<TPhysics>, ISprited<TSprite> {
    constructor(
        public physics: TPhysics,
        public sprite: TSprite) {
    }
}

export class ShapedModel<TPhysics extends ILocated,
    TShape extends IShape>
    implements IPhysical<TPhysics>, IShaped<TShape> {
    constructor(
        public physics: TPhysics,
        public shape: TShape) {
    }
}

export class GPSModel<TGame,
    TPhysics extends ILocated,
    TShape extends IShape>
    implements IGamed<TGame>, IPhysical<TPhysics>, IShaped<TShape> {
    constructor(
        public object: TGame,
        public physics: TPhysics,
        public shape: TShape) {
    }
}

export class GPSSModel<TGame,
    TPhysics extends ILocated,
    TShape extends IShape,
    TSprite extends ISprite>
    implements IGamed<TGame>, IPhysical<TPhysics>, IShaped<TShape>, ISprited<TSprite> {
    constructor(
        public object: TGame,
        public physics: TPhysics,
        public shape: TShape,
        public sprite:TSprite) {
    }
}