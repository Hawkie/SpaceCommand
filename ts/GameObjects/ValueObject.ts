import { IGameObject, SingleGameObject } from "ts/GameObjects/GameObject";
import { IView } from "ts/Views/View";
import { TextView } from "ts/Views/TextView";
import { ValueView } from "ts/Views/ValueView";
import { ITextData, TextData, IValueData, ValueData } from "ts/Data/TextData";
import { Coordinate, Vector } from "ts/Physics/Common";

import { Transforms } from "ts/Physics/Transforms";

export class ValueObject extends SingleGameObject<ValueData> {
    constructor(value: number, location: Coordinate, font: string, fontSize: number) {
        var valueData: IValueData = new ValueData(value, location);
        var view: IView = new ValueView(valueData, "", font, fontSize);
        super(()=>valueData, [], [view]);
    }
}
