import { DrawContext } from "ts/Common/DrawContext";
import { ILocated, IShapeLocated, IShapeLocatedAngled, IShape } from "ts/Models/PolyModels";
import { IParticleFieldData } from "ts/Models/ParticleFieldModel";
import { IDrawable } from "ts/DisplayObjects/DisplayObject";
import { Polygon } from "ts/DisplayObjects/DisplayObject";


export interface IView {
    display(drawContext: DrawContext);
}



export class PolyView implements IView {
    constructor(private properties: IShapeLocated) { }

    display(drawContext: DrawContext) {
        drawContext.drawP(this.properties.location, this.properties.points);
    }
}

export class ParticleFieldView implements IView {
    constructor(private properties: IParticleFieldData, private sizeX:number, private sizeY:number) { }

    display(drawContext: DrawContext) {
        this.properties.particles.forEach(point => drawContext.drawRect(point.data.location.x, point.data.location.y, this.sizeX, this.sizeY));
    }
}
