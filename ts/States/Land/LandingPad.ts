import { Coordinate, ICoordinate } from "ts/Physics/Common";
import { IShape, ShapeData } from "ts/Data/ShapeData";

export interface ILocated {
    location: Coordinate;
}

export class LandingPadModel {
    constructor(location: Coordinate) {
        var located:ICoordinate = location;
        var shape: IShape = new ShapeData([
            new Coordinate(-2, 2),
            new Coordinate(-10, 2),
            new Coordinate(-7, -10),
            new Coordinate(7, -10),
            new Coordinate(10, 2),
            new Coordinate(2, 2),
            new Coordinate(0,0),
        ]);
    }
}