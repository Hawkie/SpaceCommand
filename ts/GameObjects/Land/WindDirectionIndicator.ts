import { GameObject } from "ts/GameObjects/GameObject";
import { TextObject } from "ts/GameObjects/Common/BaseObjects";
import { Coordinate } from "ts/Physics/Common";
import { IView, PolyView } from "ts/Views/PolyViews";
import { TextView, ValueView } from "ts/Views/TextView";
import { WindData, Direction, WindModel } from "ts/Models/Land/WindModel";

// TODO: Display wind speed text next to arrow

export class WindDirectionIndicator extends GameObject<WindModel> {
    constructor(location: Coordinate) {
        var model: WindModel = new WindModel(new WindData(location));
        var viewArrow: IView = new PolyView(model.data);
        var viewText: IView = new ValueView(model.data.windStrength, "{0} mph", "monospace", 12);
        super(model, [viewArrow, viewText]);
    }
}