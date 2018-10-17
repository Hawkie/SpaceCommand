export interface IVector {
    angle: number;
    length: number;
}

export class Vector implements IVector {
    constructor(public angle: number, public length: number) { }
}