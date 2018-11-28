
export interface ISpinnable {
    angle: number;
}

export function UpdateAngle<T extends ISpinnable>(timeModifier: number, spinnable: T, spin: number): T {
    return Object.assign({}, spinnable, {
        angle: spinnable.angle + (spin * timeModifier)
    });
}