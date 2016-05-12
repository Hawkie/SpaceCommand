//import { StaticObject } from "../GameObjects/SpaceObject";
//import { Coordinate } from "../Physics/Common";
//import { Polygon } from "../DisplayObjects/DisplayObject";
//import { DrawContext } from "../Common/DrawContext";
//import { IGravityObject, ShapeLocatedModel } from "../Models/PolyModels";
//import { IView, PolyView } from "../Views/PolyViews";
//import { WindDirectionIndicatorModel } from "../Space/Wind";
//import { TextObject } from "../GameObjects/SpaceObject";

//// TODO: Display wind speed text next to arrow

//export class WindDirectionIndicator extends StaticObject<WindDirectionIndicatorModel> {
//    constructor(location: Coordinate) {
//        var model: WindDirectionIndicatorModel = new WindDirectionIndicatorModel(location);
//        var view: IView = new PolyView(model);
//        super(model, [], [view]);
//    }

//    changeWindDirection() {
//        this.model.blowingRight = !this.model.blowingRight; // invert
//        this.model.updatePolygon();
//    }
//}

//export class Wind extends WindDirectionIndicator {
//    private text: TextObject;

//    constructor(location: Coordinate, private windSpeed: number, private windChangeChance: number) {
//        super(location);
//        this.text = new TextObject(String(this.windSpeed / 4) + " mph", new Coordinate(location.x - 12, location.y + 2), "monospace", 12);
//    }

//    update(lastTimeModifier: number, player: IGravityObject = null) { // default to null so overloading works
//        super.update(lastTimeModifier);
//        if (player) {
//            if (this.model.blowingRight) {
//                player.velX += (this.windSpeed * lastTimeModifier);
//            } else {
//                player.velX -= (this.windSpeed * lastTimeModifier);
//            }
//        }

//        // TODO take lastTimeModifier into account
//        if (!(Math.floor(Math.random() * this.windChangeChance))) { // there's a 1 in windChangeChance of the wind changing direction
//            console.log("Changing wind direction!");
//            this.changeWindDirection();
//        }

//        this.text.update(lastTimeModifier);
//    }

//    display(drawingContext: DrawContext) {
//        super.display(drawingContext);
//        this.text.display(drawingContext);
//    }
//}