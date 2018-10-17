import { IActor } from "ts/gamelib/Actors/Actor";
import { ISlider } from "./Slider";

export interface IControlPanelModel extends IActor {
    selectedControl: number;
    sliders: ISlider[];
    onIncrease(amount: number): void;
    onDecrease(amount: number): void;
    onNextSelection(): void;
    onPreviousSelection(): void;
}

export class ControlPanelModel implements IActor, IControlPanelModel {
    selectedControl: number;
    constructor(public sliders: ISlider[]) {
        this.selectedControl = 0;
    }

    update(timeModifier: number): void { //
    }

    onIncrease(amount: number = 1): void {
        var v: number = this.sliders[this.selectedControl].value;
        var c: number = this.sliders[this.selectedControl].stepSize;
        v += c;
        if (v > this.sliders[this.selectedControl].max) {
            v = this.sliders[this.selectedControl].min;
        }
        this.sliders[this.selectedControl].value = Math.round(v * 100) / 100;
    }

    onDecrease(amount: number = 1): void {
        var v: number = this.sliders[this.selectedControl].value;
        var c: number = this.sliders[this.selectedControl].stepSize;
        v -= c;
        if (v < this.sliders[this.selectedControl].min) {
            v = this.sliders[this.selectedControl].max;
        }
        this.sliders[this.selectedControl].value = Math.round(v*100)/100;
    }

    onNextSelection(): void {
        this.selectedControl += 1;
        if (this.selectedControl >= this.sliders.length) {
            this.selectedControl = 0;
        }
    }

    onPreviousSelection(): void {
        this.selectedControl -= 1;
        if (this.selectedControl < 0) {
            this.selectedControl = this.sliders.length - 1;
        }
    }

    onToggle(): void {
        this.sliders[this.selectedControl].enabled = !this.sliders[this.selectedControl].enabled;
    }
}