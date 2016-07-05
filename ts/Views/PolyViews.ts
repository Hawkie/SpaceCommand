import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate } from "ts/Physics/Common";
import { ILocated, ILocatedAngled } from "ts/Data/PhysicsData";
import { IShape, ShapeData, RectangleData, CircleData } from "ts/Data/ShapeData";
import { IView } from "ts/Views/View";
import { IGraphic, GraphicData } from "ts/Data/GraphicData";

export class RectangleView implements IView {
    constructor(private properties: ILocated, private rectangle: RectangleData) { 
    }

    display(drawContext: DrawContext) {
        drawContext.drawRect(this.properties.location.x, this.properties.location.y, this.rectangle.width, this. rectangle.height);
        drawContext.fill();
    }
}

export class CircleView implements IView {
    constructor(private properties: ILocated, private circle: CircleData) {
    }

    display(drawContext: DrawContext) {
        drawContext.drawCircle(this.properties.location.x, this.properties.location.y, this.circle.radius);
        drawContext.fill();
    }
}

export class PolyView implements IView {
    constructor(private properties: ILocated, private shape: ShapeData) { }

    display(drawContext: DrawContext) {
        drawContext.drawP(this.properties.location, this.shape.points);
        drawContext.fill();
    }
}

export class PolyGraphic implements IView {
    constructor(private properties: ILocated, private shape: ShapeData, private graphic: GraphicData) { }

    display(drawContext: DrawContext) {
        if (this.graphic.loaded) {
            drawContext.drawP(this.properties.location, this.shape.points);
            let fillStyle: CanvasPattern = drawContext.createPattern(this.graphic.img);
            drawContext.fill(fillStyle);
        }
    }
}

export class PolyGraphicAngled implements IView {
    constructor(private properties: ILocatedAngled, private shape: ShapeData, private graphic: GraphicData) { }

    display(drawContext: DrawContext) {
        if (this.graphic.loaded) {
            drawContext.drawP(this.properties.location, this.shape.points);
            drawContext.save();
            drawContext.translate(this.properties.location.x, this.properties.location.y);
            drawContext.rotate(this.properties.angle);
            let fillStyle: CanvasPattern = drawContext.createPattern(this.graphic.img);
            drawContext.fill(fillStyle);
            drawContext.restore();
        }
    }
}

