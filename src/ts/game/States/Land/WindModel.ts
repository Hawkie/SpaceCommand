import { Coordinate, ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
import { IShape, Shape } from "../../../gamelib/DataTypes/Shape";
import { IWind, Direction, Wind } from "../../../gamelib/DataTypes/Wind";


export class WindModel {

    constructor(location:ICoordinate) {
        let l:ICoordinate = location;
        let s:IShape = new Shape([]);
        let wind:IWind = new Wind(new Coordinate(location.x, location.y), 0, Direction.right);
    }
}