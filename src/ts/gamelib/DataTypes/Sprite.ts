import { Coordinate } from "ts/gamelib/DataTypes/Coordinate";
import { IGraphic, Graphic } from "ts/gamelib/DataTypes/Graphic";

export class SpriteFrame {
    constructor(public x: number,
        public y: number,
        public width: number,
        public height: number) { }
}

export interface ISprite extends IGraphic {
    frames: SpriteFrame[];
    index: number;
    scaleX: number;
    scaleY: number;

    frame: SpriteFrame;
}


export class Sprite extends Graphic implements ISprite {

    constructor(src: string,
        public frames: SpriteFrame[],
        public index:number = 0,
        public scaleX: number = 1,
        public scaleY: number = 1) {
        super(src);
    }

    get frame(): SpriteFrame {
        return this.frames[this.index];
    }
}

export class HorizontalSpriteSheet extends Sprite {
    constructor(src: string,
        width: number,
        height: number,
        totalFrames: number,
        index:number = 0,
        scaleX: number = 1,
        scaleY: number = 1) {
        var frames: SpriteFrame[] = [];
        for (let i: number = 0; i < totalFrames; i++) {
            let w: number = i * width;
            frames.push(new SpriteFrame(w, 0, width, height));
        }
        super(src, frames, index, scaleX, scaleY);
    }
}