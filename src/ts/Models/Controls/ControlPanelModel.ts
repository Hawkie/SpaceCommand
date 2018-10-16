import { IActor } from "ts/gamelib/Actors/Actor";

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

export interface IControlPanelModel extends IActor {
    selectedControl: number;
    sliders: ISlider[];
    onIncrease(amount: number);
    onDecrease(amount: number);
    onNextSelection();
    onPreviousSelection()
}


export class ControlPanelModel implements IActor, IControlPanelModel {
    selectedControl: number;
    constructor(public sliders: ISlider[]) {
        this.selectedControl = 0;
    }

    update(timeModifier: number) { }

    onIncrease(amount: number = 1) {
        var v = this.sliders[this.selectedControl].value;
        var c = this.sliders[this.selectedControl].stepSize;
        v += c
        if (v > this.sliders[this.selectedControl].max) {
            v = this.sliders[this.selectedControl].min;
        }
        this.sliders[this.selectedControl].value = Math.round(v * 100) / 100;
    }

    onDecrease(amount: number = 1) {
        var v = this.sliders[this.selectedControl].value;
        var c = this.sliders[this.selectedControl].stepSize;
        v -= c;
        if (v < this.sliders[this.selectedControl].min) {
            v = this.sliders[this.selectedControl].max;
        }
        this.sliders[this.selectedControl].value = Math.round(v*100)/100
    }

    onNextSelection() {
        this.selectedControl += 1;
        if (this.selectedControl >= this.sliders.length)
            this.selectedControl = 0;
    }

    onPreviousSelection() {
        this.selectedControl -= 1;
        if (this.selectedControl < 0)
            this.selectedControl = this.sliders.length - 1;
    }

    onToggle() {
        this.sliders[this.selectedControl].enabled = !this.sliders[this.selectedControl].enabled;
    }
}