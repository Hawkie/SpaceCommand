import { ICoordinate, Coordinate, IVector, Vector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";

export interface IShape {
    points: Coordinate[];
}

export class ShapeData implements IShape {
    constructor(public points: Coordinate[]) { }
}

export class RectangleData {

    constructor(public width: number, public height: number) { }
}


export class CircleData {

    constructor(public radius: number) { }
}