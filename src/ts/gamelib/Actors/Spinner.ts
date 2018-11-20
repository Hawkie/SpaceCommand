
export interface ISpinnable {
    angle: number;
}

export function UpdateAngle(timeModifier: number, spinnable: ISpinnable, spin: number): ISpinnable {
    return Object.assign({}, spinnable, {
        angle: spinnable.angle + (spin * timeModifier)
    });
}