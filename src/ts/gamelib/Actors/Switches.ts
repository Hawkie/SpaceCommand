﻿import { IActor } from "ts/gamelib/Actors/Actor";
import { IGameObject } from "../GameObjects/IGameObject";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";

export interface ISwitch {
    enabled: boolean;
    value: number;
    repeat: number;
}

export class Flasher implements IActor {

    flashed: number = 0;
    constructor(public getSwitch: ()=> ISwitch, private valueOut: (value:number)=> void) { }

    update(timeModifier: number): void {
        let inputs:ISwitch = this.getSwitch();
        if (inputs.enabled) {
            if (this.flashed < inputs.repeat) {
                if (inputs.value === 0) {
                    this.valueOut(1);
                } else {
                    this.valueOut(0);
                }
                this.flashed++;
            }
        }
    }
}
