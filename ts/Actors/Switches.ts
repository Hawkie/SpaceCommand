import { IActor } from "ts/Actors/Actor";
import { ISwitch } from "ts/Data/EffectData";
import { IGameObject, SingleGameObject } from "ts/GameObjects/GameObject";

export class Flasher implements IActor {

    flashed: number = 0;
    constructor(public flash: ISwitch) { }

    update(timeModifier: number) {
        if (this.flash.enabled) {
            if (this.flashed < this.flash.repeat) {
                if (this.flash.value) this.flash.value = false;
                else this.flash.value = true;
                this.flashed++;
            }
        }
    }
}
