import { IActor } from "ts/Actors/Actor";
import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate } from "ts/Physics/Common";
import { ILocated, IMoving  } from "ts/Data/PhysicsData";
import { ISprite } from "ts/Data/SpriteData";

export class SpriteAnimator implements IActor {

    lastChanged: number;
    durationSec: number;

    constructor(private spriteSheet: ISprite,
        private animationFrames: number[],
        private frameDurationSec: number[],
        public animationIndex: number = 0,
        public scaleX: number = 1,
        public scaleY: number = 1) {
        this.lastChanged = Date.now();
        // get initial frame duration
        if (this.frameDurationSec.length > this.animationIndex) {
            this.durationSec = this.frameDurationSec[this.animationIndex];
        }
        this.changeFrame();
    }

    update(timeModifier: number) {
        var now = Date.now();
        if (this.frameDurationSec.length > this.animationIndex) {
            this.durationSec = this.frameDurationSec[this.animationIndex];
        }

        let timeElapsedSec = (now - this.lastChanged)/1000;
        if (timeElapsedSec >= this.durationSec)
            this.changeFrame();
    }

    private changeFrame() {
        if (this.animationFrames.length > this.animationIndex) {
            let frameIndex:number = this.animationFrames[this.animationIndex];
            if (this.spriteSheet.frames.length > frameIndex) {
                this.spriteSheet.index = frameIndex;
            }
            this.animationIndex++;
        }
        // reset anim counter
        if (this.animationIndex >= this.animationFrames.length) {
            this.animationIndex = 0;
        }
        this.lastChanged = Date.now();
    }
}

