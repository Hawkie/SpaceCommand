import { DrawContext } from "ts/Common/DrawContext";
import { ILocated, IAngled, ILocatedAngled } from "ts/Data/PhysicsData";
import { ISprite } from "ts/Data/SpriteData";
import { IView } from "ts/Views/View";

// Binds data object to drawable item
export class SpriteView implements IView {
    constructor(private properties: ILocated, private sprite: ISprite) { }

    display(drawContext: DrawContext) {
        if (this.sprite.loaded)
            drawContext.drawSprite(this.sprite.img, this.sprite.frame.x, this.sprite.frame.y, this.sprite.frame.width, this.sprite.frame.height, this.properties.location.x, this.properties.location.y, this.sprite.frame.width * this.sprite.scaleX, this.sprite.frame.height * this.sprite.scaleY);
    }
}

export class SpriteAngledView implements IView {
    constructor(private properties: ILocatedAngled, private sprite: ISprite) { }

    display(drawContext: DrawContext) {

        if (this.sprite.loaded) {
            drawContext.save();
            drawContext.translate(this.properties.location.x, this.properties.location.y);
            drawContext.rotate(this.properties.angle);
            drawContext.translate(-this.properties.location.x, -this.properties.location.y);

            drawContext.drawSprite(this.sprite.img, this.sprite.frame.x, this.sprite.frame.y, this.sprite.frame.width, this.sprite.frame.height, this.properties.location.x, this.properties.location.y, this.sprite.frame.width* this.sprite.scaleX, this.sprite.frame.height*this.sprite.scaleY);

            drawContext.restore();
        }
    }
}