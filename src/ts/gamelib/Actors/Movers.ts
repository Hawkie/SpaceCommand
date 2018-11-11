import { IActor } from "../Actors/Actor";

export interface IMoveIn {
    Vx: number;
    Vy: number;
}

export interface IMoveOut {
    dx: number;
    dy: number;
}

export interface IMoveable {
    x: number;
    y: number;
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

// function that takes velocity and time, returning change in position
export function move(timeModifier: number, Vx: number, Vy: number): IMoveOut {
    return {
        dx: Vx * timeModifier,
        dy: Vy * timeModifier,
    };
}

// reducer generates new object with new x and y values to go back into state
export function MoveReducer<T extends IMoveable>(v: IMoveOut, moveable: T): T {
    const newMoveable:T = Object.assign({},
        moveable, {
            x: moveable.x + v.dx,
            y: moveable.y + v.dy
        });
    return newMoveable;
}

// function that takes velocity and time and a moveable object. Returns a copy of the moved object.
export function Move<T extends IMoveable>(timeModifier: number, Vx: number, Vy: number, moveable: T): T {
    // reducer with action to new object
    const v: IMoveOut = move(timeModifier, Vx, Vy);
    const o: T = MoveReducer<T>(v, moveable);
    return o;
}