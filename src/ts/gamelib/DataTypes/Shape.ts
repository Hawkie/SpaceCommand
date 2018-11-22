import { Coordinate } from "../../../../src/ts/gamelib/DataTypes/Coordinate";

export interface IShape {
    readonly points: ReadonlyArray<Coordinate>;
    readonly offset: Coordinate;
}

export class Shape implements IShape {
    constructor(public points: Coordinate[], public offset: Coordinate = new Coordinate(0,0)) { }
}

