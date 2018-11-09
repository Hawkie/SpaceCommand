import { Coordinate } from "../../../../src/ts/gamelib/DataTypes/Coordinate";

export interface IShape {
    points: Coordinate[];
    offset: Coordinate;
}

export class Shape implements IShape {
    constructor(public points: Coordinate[], public offset: Coordinate = new Coordinate(0,0)) { }
}

