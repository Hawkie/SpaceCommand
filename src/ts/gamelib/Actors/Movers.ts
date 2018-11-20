export interface IMoveIn {
    Vx: number;
    Vy: number;
}

export interface IMoveable {
    x: number;
    y: number;
}

// reducer generates new object with new x and y values to go back into state
export function MoveWithVelocity<TState extends IMoveable>(timeModifier: number, moveable: TState, Vx: number, Vy: number): TState {
    return Object.assign({}, moveable, {
        x: moveable.x + (Vx * timeModifier),
        y: moveable.y + (Vy * timeModifier),
    });
}