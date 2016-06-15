import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate } from "ts/Physics/Common";
import { ILocated } from "ts/Data/PhysicsData";
import { IShape } from "ts/Data/ShapeData";
import { IView } from "ts/Views/View";
import { IGraphic } from "ts/Data/GraphicData";


export class PolyView implements IView {
    constructor(private properties: ILocated, private shape: IShape) { }

    display(drawContext: DrawContext) {
        drawContext.drawP(this.properties.location, this.shape.points);
    }
}

export class PolyGraphic implements IView {
    constructor(private properties: ILocated, private shape: IShape, private graphic: IGraphic) { }

    display(drawContext: DrawContext) {
        if (this.graphic.loaded) {
            let fillStyle :CanvasPattern = drawContext.createPattern(this.graphic.img);
            drawContext.drawP(this.properties.location, this.shape.points, fillStyle);
        }
    }
}

