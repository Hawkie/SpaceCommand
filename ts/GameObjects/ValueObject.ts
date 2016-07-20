import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
//import { DynamicModel } from "ts/Models/DynamicModels";
import { IView } from "ts/Views/View";
import { TextView, ValueView } from "ts/Views/TextView";
import { ITextData, TextData, IValueData, ValueData } from "ts/Data/TextData";
import { Coordinate, Vector } from "ts/Physics/Common";

import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";

export class ValueObject extends GameObject<ValueData> {
    constructor(value: number, location: Coordinate, font: string, fontSize: number) {
        var valueData = new ValueData(value, location);
        var view: IView = new ValueView(valueData, "", font, fontSize);
        super(valueData, [], [view]);
    }
}
