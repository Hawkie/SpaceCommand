export interface ICoordinate {
    x: number;
    y: number;
}

export class Coordinate implements ICoordinate {
    constructor(public x: number, public y: number) { }
}