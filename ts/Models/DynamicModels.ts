import { ILocated, IMoving } from "ts/Data/PhysicsData";
import { IShape, ShapeData } from "ts/Data/ShapeData";
import { IGraphic, GraphicData } from "ts/Data/GraphicData";
import { ISprite, Sprite } from "ts/Data/SpriteData";
import { IActor } from "ts/Actors/Actor";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator } from "ts/Actors/Rotators";
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

export interface IGraphical<TGraphic extends IGraphic> {
    graphic: TGraphic;
}

export interface IShapedModel<TPhysics extends ILocated, TShape extends IShape> extends IPhysical<TPhysics>, IShaped<TShape> { }

export class Model<TPhysics extends ILocated> implements IPhysical<TPhysics> {
    constructor(
        public physics: TPhysics) {
    }
}

// export class GraphicModel<TPhysics extends ILocated,
//     TGraphic extends IGraphic>
//     implements IPhysical<TPhysics>, IGraphical<TGraphic> {
//     constructor(
//         public physics: TPhysics,
//         public graphic: TGraphic) {
//     }
// }

export class ShapedModel<TPhysics extends ILocated,
    TShape>
    implements IPhysical<TPhysics> {
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
