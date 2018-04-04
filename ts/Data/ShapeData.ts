import { Coordinate, Vector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";

export interface IShape {
    points: Coordinate[];
    offset: Coordinate;
}

export class ShapeData implements IShape {
    constructor(public points: Coordinate[], public offset: Coordinate = new Coordinate(0,0)) { }
}

export class RectangleData {

    constructor(public width: number, public height: number) { }
}

