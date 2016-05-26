import { DrawContext } from "ts/Common/DrawContext";
import { ILocated, ILocatedAngled, IShapeLocatedAngled, IShape } from "ts/Models/PolyModels";
import { IParticleFieldData } from "ts/Models/ParticleFieldModel";
import { IDrawable } from "ts/DisplayObjects/DisplayObject";
import { IView } from "ts/Views/PolyViews";

// Binds data object to drawable item
export class GraphicView implements IView {
    constructor(private properties: ILocated, private drawable: IDrawable) { }

    display(drawContext: DrawContext) {
        this.drawable.draw(this.properties.location, drawContext);
    }
}

export class AngledView implements IView {
    constructor(private properties: ILocatedAngled , private drawable: IDrawable) { }

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