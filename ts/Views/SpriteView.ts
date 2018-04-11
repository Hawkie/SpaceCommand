import { DrawContext } from "ts/Common/DrawContext";
import { ILocated, IAngled, ILocatedAngled } from "ts/Data/PhysicsData";
import { ISprite } from "ts/Data/SpriteData";
import { IView } from "ts/Views/View";

// binds data object to drawable item
export class SpriteView implements IView {
    constructor(private properties: ILocated, private sprite: ISprite) { }

    display(drawContext: DrawContext): void {
        if (this.sprite.loaded) {
            drawContext.drawSprite(this.sprite.img,
                this.sprite.frame.x,
                this.sprite.frame.y,
                this.sprite.frame.width,
                this.sprite.frame.height,
                this.properties.location.x,
                this.properties.location.y,
                this.sprite.frame.width * this.sprite.scaleX,
                this.sprite.frame.height * this.sprite.scaleY);
        }
    }
}

export interface ISpriteAngled {
    x: number;
    y: number;
    angle: number;
    sprite: ISprite;
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