import { IGraphic, Graphic } from "../Elements/Graphic";

export class SpriteFrame {
    constructor(public readonly x: number,
        public readonly y: number,
        public readonly width: number,
        public readonly height: number) { }
}

export interface ISprite {
    readonly frames: SpriteFrame[]; // config
    readonly index: number;
    readonly scaleX: number;
    readonly scaleY: number;
}


export class Sprite implements ISprite {

    constructor(public readonly frames: SpriteFrame[],
        public readonly index:number = 0,
        public readonly scaleX: number = 1,
        public readonly scaleY: number = 1) {
    }
}

export class HorizontalSpriteSheet extends Sprite {
    constructor(width: number,
        height: number,
        totalFrames: number,
        index:number = 0,
        scaleX: number = 1,
        scaleY: number = 1) {
        let frames: SpriteFrame[] = [];
        for (let i: number = 0; i < totalFrames; i++) {
            let w: number = i * width;
            frames.push(new SpriteFrame(w, 0, width, height));
        }
        super(frames, index, scaleX, scaleY);
    }
}