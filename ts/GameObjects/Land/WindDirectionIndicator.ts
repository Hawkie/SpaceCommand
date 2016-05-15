import { GameObject } from "ts/GameObjects/GameObject";
import { TextObject } from "ts/GameObjects/Common/BaseObjects";
import { Coordinate } from "ts/Physics/Common";
import { Polygon } from "ts/DisplayObjects/DisplayObject";
import { DrawContext } from "ts/Common/DrawContext";
import { IGravityObject, ShapeLocatedData } from "ts/Models/PolyModels";
import { DynamicModel, IModel } from "ts/Models/DynamicModels";
import { IView, PolyView } from "ts/Views/PolyViews";
import { TextView, ValueView } from "ts/Views/TextView";
import { WindModel, Direction } from "ts/Models/Land/WindModel";
import { IActor } from "ts/Actors/Actor";
import { WindGenerator } from "ts/Actors/WindGenerator";

// TODO: Display wind speed text next to arrow

export class WindDirectionIndicator extends GameObject<WindModel> {
    constructor(location: Coordinate) {
        var model: IModel<WindModel> = new DynamicModel<WindModel>(new WindModel(location));
        var viewArrow: IView = new PolyView(model.data);
        var viewText: IView = new ValueView(model.data.windStrength, "{0} mph", "monospace", 12);
        var windGenerator: IActor = new WindGenerator(model.data);
        super(model, [windGenerator], [viewArrow, viewText]);
    }

    windEffect(lastTimeModifier: number, player: IGravityObject) { // default to null so overloading works
            if (this.model.data.windRightLeft == Direction.right) {
                player.velX += (this.model.data.windStrength.value * lastTimeModifier);
            } else {
                player.velX -= (this.model.data.windStrength.value * lastTimeModifier);
            }
    }
}