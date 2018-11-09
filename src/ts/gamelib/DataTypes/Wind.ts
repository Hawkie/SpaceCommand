import { Coordinate } from "src/ts/gamelib/DataTypes/Coordinate";

export enum Direction {
    left,
    right
}

export interface IWind {
    location: Coordinate;
    value: number;
    windDirection: Direction;
}

export class Wind implements IWind {
    constructor(public location: Coordinate,
        public value: number,
        public windDirection: Direction) { }
}