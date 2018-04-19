import { IGameObject, SingleGameObject } from "ts/GameObjects/GameObject";
import { IView } from "ts/Views/View";
import { TextView } from "ts/Views/TextView";
import { ValueView } from "ts/Views/ValueView";
import { ITextData, TextData, IValueData, ValueData } from "ts/Data/TextData";
import { IActor } from "ts/Actors/Actor";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator } from "ts/Actors/Rotators";
import { Transforms } from "ts/Physics/Transforms";

export class TextObject extends SingleGameObject<ITextData> {
    constructor(text: string, location: Coordinate, font: string, fontSize: number) {
        var textData: TextData = new TextData(text, location);
        var view: IView = new TextView(textData, font, fontSize);
        super(()=>textData, [], [view]);
    }
}
