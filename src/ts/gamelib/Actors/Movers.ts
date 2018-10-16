import { IActor } from "ts/gamelib/Actors/Actor";

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
        var mIn: IMoveIn = this.getIn();
        this.setOut(MoveConstVelocity.move(timeModifier, mIn));
    }

    static move(timeModifier: number, mIn: IMoveIn): IMoveOut {
        var mOut: IMoveOut = {
            dx: mIn.Vx * timeModifier,
            dy: mIn.Vy * timeModifier,
        };
        return mOut;
    }
}