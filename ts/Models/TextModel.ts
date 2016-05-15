import { Coordinate } from "../Physics/Common";

export interface ITextData {
    text: string;
    location: Coordinate;
}

export class TextData implements ITextData {
    constructor(public text: string, public location: Coordinate) {
    }
}

export interface IValueData {
    value: number;
    location: Coordinate;
}

export class ValueData implements IValueData {
    constructor(public value: number, public location: Coordinate) {
    }
}