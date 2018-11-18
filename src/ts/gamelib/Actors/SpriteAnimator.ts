import { IActor } from "../../../../src/ts/gamelib/Actors/Actor";
import { ISprite } from "../../../../src/ts/gamelib/DataTypes/Sprite";

// export class SpriteAnimator implements IActor {

//     lastChanged: number;
//     durationSec: number;

//     constructor(private spriteSheet: ISprite,
//         private animationFrames: number[],
//         private frameDurationSec: number[],
//         public animationIndex: number = 0,
//         public scaleX: number = 1,
//         public scaleY: number = 1) {
//         this.lastChanged = Date.now();
//         // get initial frame duration
//         if (this.frameDurationSec.length > this.animationIndex) {
//             this.durationSec = this.frameDurationSec[this.animationIndex];
//         }
//         this.changeFrame();
//     }

//     update(timeModifier: number): void {
//         let now: number = Date.now();
//         if (this.frameDurationSec.length > this.animationIndex) {
//             this.durationSec = this.frameDurationSec[this.animationIndex];
//         }

//         let timeElapsedSec: number = (now - this.lastChanged)/1000;
//         if (timeElapsedSec >= this.durationSec) {
//             this.changeFrame();
//         }
//     }

//     private changeFrame(): void {
//         if (this.animationFrames.length > this.animationIndex) {
//             let frameIndex:number = this.animationFrames[this.animationIndex];
//             if (this.spriteSheet.frames.length > frameIndex) {
//                 this.spriteSheet.index = frameIndex;
//             }
//             this.animationIndex++;
//         }
//         // reset anim counter
//         if (this.animationIndex >= this.animationFrames.length) {
//             this.animationIndex = 0;
//         }
//         this.lastChanged = Date.now();
//     }
// }


export function AddElapsedTime(timeModifier: number, elapsedTime: number, timeCheck: number): number {
    let accumulatedTime: number = elapsedTime + timeModifier;
    if (accumulatedTime >= timeCheck) {
        accumulatedTime = 0;
    }
    return accumulatedTime;
}

export function AddCounter(timeModifier: number, counter: number, resetWhen: number = undefined, resetTo:number = 0): number {
    counter++;
    // check our index is within frame array
    if (resetWhen !== undefined && counter >= resetWhen) {
        counter = resetTo;
    }
    return counter;
}

export interface IAnimator {
    readonly elapsedTime: number; // state
    readonly animationCounter: number; // state
}

export function UpdateAnimator<T extends IAnimator>(timeModifier: number, animator: T,
        animationDuration: number,
        animationSequence: number[]): T {
    const time: number = AddElapsedTime(timeModifier, animator.elapsedTime, animationDuration);
    let c: number = animator.animationCounter;
    if (time === 0) {
        c = AddCounter(timeModifier, animator.animationCounter, animationSequence.length);
    }
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
