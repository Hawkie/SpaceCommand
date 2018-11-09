import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { IView } from "../../../gamelib/Views/View";
import { ISpriteView } from "./SpriteView";


export interface ISpriteAngled extends ISpriteView {
    angle: number;
}
export class SpriteAngledView implements IView {
    constructor(private getInputs: () => ISpriteAngled) { }
    display(drawContext: DrawContext): void {
        let inputs: ISpriteAngled = this.getInputs();
        if (inputs.sprite.loaded) {
            let xOffset: number = inputs.x + (inputs.sprite.frame.width * inputs.sprite.scaleX / 2);
            let yOffset: number = inputs.y + (inputs.sprite.frame.height * inputs.sprite.scaleY / 2);
            drawContext.save();
            drawContext.translate(xOffset, yOffset);
            drawContext.rotate(inputs.angle);
            drawContext.translate(-xOffset, -yOffset);
            // tODO: use single drawsprite function
            drawContext.drawSprite(inputs.sprite.img,
                inputs.sprite.frame.x,
                inputs.sprite.frame.y,
                inputs.sprite.frame.width,
                inputs.sprite.frame.height,
                inputs.x, inputs.y,
                inputs.sprite.frame.width * inputs.sprite.scaleX,
                inputs.sprite.frame.height * inputs.sprite.scaleY);
            drawContext.restore();
        }
    }
}