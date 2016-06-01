import { Coordinate } from "ts/Physics/Common";

export enum Direction {
    left,
    right
}

export interface IWind {
    location: Coordinate;
    value: number;
    windDirection: Direction;
}

export class WindData implements IWind {
    constructor(public location: Coordinate,
        public value: number,
        public windDirection: Direction) { }
}