import { IEffect } from "./Effect";
import { ILocated, ILocatedAndAngled } from "../GameObjects/GameObject";
import { IDrawable } from "../DisplayObjects/DisplayObject";
import { DrawContext } from "../Common/DrawContext";

export class Draw implements IEffect {
    constructor(private properties: ILocated, private drawable: IDrawable) { }

    display(drawContext: DrawContext) {
        this.drawable.draw(this.properties.location, drawContext);
    }
}

export class DrawRotated implements IEffect {
    constructor(private properties: ILocatedAndAngled, private drawable: IDrawable) { }

    display(drawContext: DrawContext) {
        drawContext.translate(this.properties.location.x, this.properties.location.y);
        drawContext.rotate(this.properties.angle);
        drawContext.translate(-this.properties.location.x, -this.properties.location.y);

        this.drawable.draw(this.properties.location, drawContext);

        drawContext.translate(this.properties.location.x, this.properties.location.y);
        drawContext.rotate(-this.properties.angle);
        drawContext.translate(-this.properties.location.x, -this.properties.location.y);
    }
}