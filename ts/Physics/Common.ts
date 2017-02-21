export interface IVector {
    angle: number;
    length: number;
}

export interface IOrthogonalVectors {
    a: number;
    b: number;
    angleA: number;
}

export class Vector implements IVector{
    constructor(public angle: number, public length: number) { }
}

export interface ICoordinate {
    x: number;
    y: number;
}

export class Coordinate implements ICoordinate {
    constructor(public x: number, public y: number) { }
}

export class OrthogonalVectors implements IOrthogonalVectors {
    constructor(public a: number, public b:number, public angleA: number) { } 
}