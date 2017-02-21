import { IGameObject, SingleGameObject } from "ts/GameObjects/GameObject";
//import { DynamicModel } from "ts/Models/DynamicModels";
import { IView } from "ts/Views/View";
import { TextView, ValueView } from "ts/Views/TextView";
import { ITextData, TextData, IValueData, ValueData } from "ts/Data/TextData";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator, Spinner } from "ts/Actors/Rotators";
import { Accelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";

export class TextObject extends SingleGameObject<ITextData> {
    constructor(text: string, location: Coordinate, font: string, fontSize: number) {
        var textData = new TextData(text, location);
        var view: IView = new TextView(textData, font, fontSize);
        super(textData, [], [view]);
    }
}
