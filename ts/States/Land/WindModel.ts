import { Coordinate, ICoordinate } from "ts/Physics/Common";
import { IShape, ShapeData } from "ts/Data/ShapeData";
import { IWind, Direction, WindData } from "ts/Data/WindData";


export class WindModel {

    constructor(location:ICoordinate) {
        var l:ICoordinate = location;
        var s:IShape = new ShapeData([]);
        var wind:IWind = new WindData(new Coordinate(location.x, location.y), 0, Direction.right);
    }
}