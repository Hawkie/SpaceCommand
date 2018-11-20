import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { ISprite, SpriteFrame } from "../../../gamelib/DataTypes/Sprite";
import { IGraphic } from "../../Elements/Graphic";

export function DrawSprite(ctx: DrawContext, x: number, y: number, sprite: ISprite, spriteImg: IGraphic): void {
    const frame: SpriteFrame = sprite.frames[sprite.index];
    ctx.drawSprite(spriteImg.img,
        frame.x,
        frame.y,
        frame.width,
        frame.height,
        x, y,
        frame.width * sprite.scaleX,
        frame.height * sprite.scaleY);
}


