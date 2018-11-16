import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { ISprite } from "../../../gamelib/DataTypes/Sprite";
import { IView } from "../../../gamelib/Views/View";
import { IGraphic } from "../../DataTypes/Graphic";

export interface ISpriteView {
    x: number;
    y: number;
    sprite: ISprite;
}

// binds data object to drawable item
export class SpriteView implements IView {
    constructor(private getInputs: ()=>ISpriteView) { }

    display(drawContext: DrawContext): void {
        let inputs: ISpriteView = this.getInputs();
        if (inputs.sprite.loaded) {
            drawContext.drawSprite(inputs.sprite.img,
                inputs.sprite.frame.x,
                inputs.sprite.frame.y,
                inputs.sprite.frame.width,
                inputs.sprite.frame.height,
                inputs.x,
                inputs.y,
                inputs.sprite.frame.width * inputs.sprite.scaleX,
                inputs.sprite.frame.height * inputs.sprite.scaleY);
        }
    }
}

export function DrawSprite(ctx: DrawContext, x: number, y: number, sprite: ISprite, spriteImg: IGraphic): void {
    ctx.drawSprite(spriteImg.img,
        sprite.frame.x,
        sprite.frame.y,
        sprite.frame.width,
        sprite.frame.height,
        x, y,
        sprite.frame.width * sprite.scaleX,
        sprite.frame.height * sprite.scaleY);
}


