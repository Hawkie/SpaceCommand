import { Coordinate, ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
import { IShape, Shape } from "../../../gamelib/DataTypes/Shape";

export interface ILocated {
    location: Coordinate;
}

export class LandingPadModel {
    constructor(location: Coordinate) {
        let located:ICoordinate = location;
        let shape: IShape = new Shape([
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