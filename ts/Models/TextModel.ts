import { Coordinate } from "../Physics/Common";

export interface ITextModel {
    text: string;
    location: Coordinate;
}

export class TextModel implements ITextModel {
    constructor(public text: string, public location: Coordinate) {
    }
}

export interface IValueModel {
    value: number;
    location: Coordinate;
}

export class ValueModel implements IValueModel {
    constructor(public value: number, public location: Coordinate) {
    }
}