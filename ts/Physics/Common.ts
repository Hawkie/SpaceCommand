export interface ICoordinate {
    x: number;
    y: number;
}

export interface IVector {
    angle: number;
    length: number;
}

export class Vector implements IVector {
    constructor(public angle: number, public length: number) { }
}


export class Coordinate implements ICoordinate {
    constructor(public x: number, public y: number) { }
}