import { Coordinate } from "ts/gamelib/DataTypes/Coordinate";
import { Transforms } from "ts/gamelib/Physics/Transforms";

export interface IShape {
    points: Coordinate[];
    offset: Coordinate;
}

export class Shape implements IShape {
    constructor(public points: Coordinate[], public offset: Coordinate = new Coordinate(0,0)) { }
}

