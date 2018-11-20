import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { DrawSprite } from "./SpriteView";
import { ISprite } from "../../DataTypes/Sprite";
import { IGraphic } from "../../Elements/Graphic";


export function DrawSpriteAngled(ctx: DrawContext, x: number, y: number, angle: number, sprite: ISprite, spriteImg: IGraphic): void {
    if (spriteImg.loaded) {
        let xOffset: number = x + (sprite.frames[sprite.index].width * sprite.scaleX / 2);
        let yOffset: number = y + (sprite.frames[sprite.index].height * sprite.scaleY / 2);
        ctx.save();
        ctx.translate(xOffset, yOffset);
        ctx.rotate(angle);
        ctx.translate(-xOffset, -yOffset);
        // tODO: use single drawsprite function
        DrawSprite(ctx, x, y, sprite, spriteImg);
        ctx.restore();
    }
}

