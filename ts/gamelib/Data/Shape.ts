import { Coordinate } from "ts/gamelib/Data/Coordinate";
import { Transforms } from "ts/Physics/Transforms";

export interface IShape {
    points: Coordinate[];
    offset: Coordinate;
}

export class Shape implements IShape {
    constructor(public points: Coordinate[], public offset: Coordinate = new Coordinate(0,0)) { }
}

