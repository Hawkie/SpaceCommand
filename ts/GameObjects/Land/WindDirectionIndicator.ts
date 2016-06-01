import { GameObject } from "ts/GameObjects/GameObject";
import { TextObject } from "ts/GameObjects/Common/BaseObjects";
import { Coordinate } from "ts/Physics/Common";
import { IView, PolyView } from "ts/Views/PolyViews";
import { TextView, ValueView } from "ts/Views/TextView";
import { WindModel } from "ts/Models/Land/WindModel";
import { IWind, Direction } from "ts/Data/WindData";

// TODO: Display wind speed text next to arrow

export class WindDirectionIndicator extends GameObject<WindModel> {
    constructor(location: Coordinate) {
        var model: WindModel = new WindModel(location);
        var viewArrow: IView = new PolyView(model.data, model.shape); // arrow shape
        var viewText: IView = new ValueView(model.data, "{0} mph", "monospace", 12);
        super(model, [viewArrow, viewText]);
    }
}