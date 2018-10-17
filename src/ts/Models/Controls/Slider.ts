export interface ISlider {
    name: string;
    value: number;
    min: number;
    max: number;
    stepSize: number;
    enabled: boolean;
}

export class Slider implements ISlider {
    constructor(public name: string,
        public value: number,
        public min: number = 0,
        public max: number = 10000,
        public stepSize: number = 1,
        public enabled: boolean = true) { }
}