import { IActor } from "ts/gamelib/Actors/Actor";
import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate } from "ts/gamelib/Data/Coordinate";
// import { ILocated, IMoving  } from "ts/gamelib/Data/PhysicsData";
// import { ILocatedMoving } from "ts/gamelib/Data/PhysicsData";

export interface IMoveIn {
    Vx: number;
    Vy: number;
}

export interface IMoveOut {
    dx: number;
    dy: number;
}

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