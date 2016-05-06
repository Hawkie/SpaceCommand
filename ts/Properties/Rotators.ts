import { DrawContext } from "../Common/DrawContext";
import { Coordinate } from "../Common/Coordinate";
import { IGameObject, IDrawableProperties, IDrawableAndRotatableProperties } from "../Common/GameObject";
import { IDrawable, IDrawableAndRotateable } from "../DisplayObjects/DisplayObject";

export class GeneralRotator implements IGameObject {
    constructor(private properties: IDrawableAndRotatableProperties, private drawable: IDrawable) { }

    update(timeModifier: number) { }

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

export class PolyRotator implements IGameObject {
    constructor(private properties: IDrawableAndRotatableProperties, private drawable: IDrawableAndRotateable) { }

    update(timeModifier: number) {
        this.drawable.rotate(this.properties.angle);
    }

    display(drawContext: DrawContext) {
        this.drawable.draw(this.properties.location, drawContext);
    }
}