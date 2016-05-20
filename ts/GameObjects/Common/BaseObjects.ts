import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { IShapeLocated, IShapeLocatedMoving, IShapeLocatedAngledMovingRotataing, IShapeLocatedAngledMovingRotataingAccelerating } from "../Models/PolyModels";
import { IModel, DynamicModel } from "ts/Models/DynamicModels";
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { TextView, ValueView } from "ts/Views/TextView";
import { ITextData, TextData, IValueData, ValueData } from "ts/Models/TextModel";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator, Spinner } from "ts/Actors/Rotators";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";

export class TextObject extends GameObject<IModel<ITextData>> {
    constructor(text: string, location: Coordinate, font: string, fontSize: number) {
        var textModel = new DynamicModel<ITextData>(new TextData(text, location));
        var view: IView = new TextView(textModel.data, font, fontSize);
        super(textModel, [view]);
    }
}

export class ValueController extends GameObject<IModel<IValueData>> {
    constructor(value: number, location: Coordinate, font: string, fontSize: number) {
        var valueModel = new DynamicModel<IValueData>(new ValueData(value, location));
        var view: IView = new ValueView(valueModel.data, "", font, fontSize);
        super(valueModel, [view]);
    }
}
