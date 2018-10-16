import { DrawContext } from "ts/gamelib/1Common/DrawContext";
import { ISprite } from "ts/gamelib/Data/Sprite";
import { IView } from "ts/gamelib/Views/View";

export interface ISpriteView {
    x: number;
    y: number;
    sprite: ISprite;
}

// binds data object to drawable item
export class SpriteView implements IView {
    constructor(private getInputs: ()=>ISpriteView) { }

    display(drawContext: DrawContext): void {
        var inputs: ISpriteView = this.getInputs();
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

export interface ISpriteAngled extends ISpriteView {
    angle: number;
}

export class SpriteAngledView implements IView {
    constructor(private getInputs: ()=>ISpriteAngled) { }

    display(drawContext: DrawContext): void {
        var inputs: ISpriteAngled = this.getInputs();
        if (inputs.sprite.loaded) {
            var xOffset: number = inputs.x + (inputs.sprite.frame.width* inputs.sprite.scaleX/2);
            var yOffset: number = inputs.y + (inputs.sprite.frame.height* inputs.sprite.scaleY/2);
            drawContext.save();
            drawContext.translate(xOffset, yOffset);
            drawContext.rotate(inputs.angle);
            drawContext.translate(-xOffset, -yOffset);

            drawContext.drawSprite(inputs.sprite.img,
                inputs.sprite.frame.x,
                inputs.sprite.frame.y,
                inputs.sprite.frame.width,
                inputs.sprite.frame.height,
                inputs.x,
                inputs.y,
                inputs.sprite.frame.width * inputs.sprite.scaleX,
                inputs.sprite.frame.height * inputs.sprite.scaleY);

            drawContext.restore();
        }
    }
}