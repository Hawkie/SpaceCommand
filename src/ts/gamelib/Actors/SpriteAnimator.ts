import { ISprite } from "../../../../src/ts/gamelib/DataTypes/Sprite";
import { IncreaseCounter, AddElapsedTime } from "./Helpers/Counter";

export interface IAnimator {
    readonly elapsedTime: number; // state
    readonly animationCounter: number; // state
}

export function UpdateAnimator<T extends IAnimator>(timeModifier: number, animator: T,
        animationDuration: number,
        animationSequence: ReadonlyArray<number>): T {
    const time: number = AddElapsedTime(timeModifier, animator.elapsedTime, animationDuration);
    let c: number = animator.animationCounter;
    if (time === 0) {
        c = IncreaseCounter(animator.animationCounter, animationSequence.length);
    }
    // object spread syntax doesn't work on extended types
    return Object.assign({}, animator, {
        elapsedTime: time,
        animationCounter: c,
    });
}

export function UpdateSprite<T extends ISprite>(timeModifier: number, sprite: T,
    frame: number): T {
        if (frame < sprite.frames.length) {
            return Object.assign({}, sprite, {
                index: frame,
            });
    }
    // unchanged
    return sprite;
}
