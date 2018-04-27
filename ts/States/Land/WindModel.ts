import { Coordinate, ICoordinate } from "ts/Data/Coordinate";
import { IShape, Shape } from "ts/Data/Shape";
import { IWind, Direction, Wind } from "ts/Data/Wind";


export class WindModel {

    constructor(location:ICoordinate) {
        var l:ICoordinate = location;
        var s:IShape = new Shape([]);
        var wind:IWind = new Wind(new Coordinate(location.x, location.y), 0, Direction.right);
    }
}