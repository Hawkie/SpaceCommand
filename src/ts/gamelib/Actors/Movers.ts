﻿import { IActor } from "../Actors/Actor";

export interface IMoveIn {
    Vx: number;
    Vy: number;
}

export interface IMoveOut {
    dx: number;
    dy: number;
}

// the Move Actor is used to apply velocity (over a discreet time period)
// to an objects position (x,y). The change of position is passed to the calling object to apply it to the data model.
export class MoveConstVelocity implements IActor {
    constructor(private getIn: () => IMoveIn, private setOut: (out: IMoveOut)=>void) {
    }

    update(timeModifier: number): void {
        let mIn: IMoveIn = this.getIn();
        this.setOut(move(timeModifier, mIn.Vx, mIn.Vy));
    }


}

export function move(timeModifier: number, Vx: number, Vy: number): IMoveOut {
    return {
        dx: Vx * timeModifier,
        dy: Vy * timeModifier,
    };
}