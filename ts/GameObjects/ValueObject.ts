import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { DynamicModel } from "ts/Models/DynamicModels";
import { IView } from "ts/Views/View";
import { TextView, ValueView } from "ts/Views/TextView";
import { ITextData, TextData, IValueData, ValueData } from "ts/Data/TextData";
import { Coordinate, Vector } from "ts/Physics/Common";

import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";

export class ValueObject extends GameObject<DynamicModel<IValueData>> {
    constructor(value: number, location: Coordinate, font: string, fontSize: number) {
        var valueModel = new DynamicModel<IValueData>(new ValueData(value, location));
        var view: IView = new ValueView(valueModel.data, "", font, fontSize);
        super(valueModel, [view]);
    }
}
