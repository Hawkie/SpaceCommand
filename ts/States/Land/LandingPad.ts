import { Coordinate } from "ts/Physics/Common";
import { ILocated, LocatedData } from "ts/Data/PhysicsData";
import { IShape, ShapeData } from "ts/Data/ShapeData";
import { ShapedModel } from "ts/Models/DynamicModels";

export class LandingPadModel extends ShapedModel<LocatedData> {
    constructor(location: Coordinate) {
        var located = new LocatedData(location);
        var shape = new ShapeData([
            new Coordinate(-10, -2),
            new Coordinate(-13, 10),
            new Coordinate(-10, 0),
            new Coordinate(10, 0),
            new Coordinate(13, 10),
            new Coordinate(10, -2)
        ]);
        super(located, shape, []);
    }
}