import { DrawContext } from "ts/Common/DrawContext";
import { ILocated, IShapeLocated, IShapeLocatedAngled, IShape } from "ts/Models/PolyModels";
import { IParticleFieldModel } from "ts/Models/ParticleFieldModel";
import { IDrawable } from "ts/DisplayObjects/DisplayObject";
import { Polygon } from "ts/DisplayObjects/DisplayObject";


export interface IView {
    display(drawContext: DrawContext);
}

// Binds data object to drawable item
export class GraphicView implements IView {
    constructor(private properties: ILocated, private drawable: IDrawable) { }

    display(drawContext: DrawContext) {
        this.drawable.draw(this.properties.location, drawContext);
    }
}

export class PolyView implements IView {
    constructor(private properties: IShapeLocated) { }

    display(drawContext: DrawContext) {
        drawContext.drawP(this.properties.location, this.properties.points);
    }
}

export class ParticleFieldView implements IView {
    constructor(private properties: IParticleFieldModel, private sizeX:number, private sizeY:number) { }

    display(drawContext: DrawContext) {
        this.properties.points.forEach(point => drawContext.drawRect(point.location.x, point.location.y, this.sizeX, this.sizeY));
    }
}

export class AngledView implements IView {
    constructor(private properties: IShapeLocatedAngled, private drawable: IDrawable) { }

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