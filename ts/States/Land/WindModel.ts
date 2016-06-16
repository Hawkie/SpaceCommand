import { Coordinate } from "ts/Physics/Common";
import { ValueData } from "ts/Data/TextData";
import { IShape, ShapeData } from "ts/Data/ShapeData";
import { LocatedData } from "ts/Data/PhysicsData";
import { IWind, Direction, WindData } from "ts/Data/WindData";
import { DynamicModel, ShapedModel } from "ts/Models/DynamicModels";
import { IActor } from "ts/Actors/Actor";
import { WindGenerator } from "ts/Actors/WindGenerator";

export class WindModel extends ShapedModel<WindData, IShape> {

    constructor(location:Coordinate) {
        var l = new LocatedData(location);
        var s = new ShapeData([]);
        var wind = new WindData(new Coordinate(location.x, location.y), 0, Direction.right);
        var windGenerator:IActor = new WindGenerator(wind, s);
        super(wind, s, [windGenerator]);
    }
}