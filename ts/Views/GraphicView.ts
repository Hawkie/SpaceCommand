import { DrawContext } from "ts/Common/DrawContext";
import { ILocated, IAngled, ILocatedAngled } from "ts/Data/PhysicsData";
import { IGraphic } from "ts/Data/GraphicData";
import { IParticleFieldData } from "ts/Models/ParticleFieldModel";
import { IDrawable } from "ts/DisplayObjects/DisplayObject";
import { IView } from "ts/Views/PolyViews";

// Binds data object to drawable item
export class GraphicView implements IView {
    constructor(private properties: ILocated, private graphic: IGraphic) { }

    display(drawContext: DrawContext) {
        if (this.graphic.loaded)
            drawContext.drawImage(this.graphic.img, this.properties.location.x, this.properties.location.y);
    }
}

export class GraphicAngledView implements IView {
    constructor(private properties: ILocatedAngled, private graphic: IGraphic) { }

    display(drawContext: DrawContext) {

        if (this.graphic.loaded) {
            drawContext.translate(this.properties.location.x, this.properties.location.y);
            drawContext.rotate(this.properties.angle);
            drawContext.translate(-this.properties.location.x, -this.properties.location.y);

            drawContext.drawImage(this.graphic.img, this.properties.location.x, this.properties.location.y);
            //this.drawable.draw(this.properties.location, drawContext);

            drawContext.translate(this.properties.location.x, this.properties.location.y);
            drawContext.rotate(-this.properties.angle);
            drawContext.translate(-this.properties.location.x, -this.properties.location.y);
        }
    }
}