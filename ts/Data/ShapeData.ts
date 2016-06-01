import { ICoordinate, Coordinate, IVector, Vector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";

export interface IShape {
    points: Coordinate[];
}

export class ShapeData implements IShape {
    constructor(public points: Coordinate[]) { }
}