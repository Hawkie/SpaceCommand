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
        drawContext.fillRect(this.properties.location.x, this.properties.location.y, this.rectangle.width, this.rectangle.height);
    }
}

export interface ICircleView {
    x: number;
    y: number;
    r: number;
}

export class CircleView implements IView {
    constructor(private getInputs: ()=>ICircleView) {
    }

    display(drawContext: DrawContext): void {
        var circle: ICircleView = this.getInputs();
        drawContext.drawCircle(circle.x, circle.y, circle.r);
    }
}

export class PolyView implements IView {
    constructor(private properties: ILocated, private shape: ShapeData) { }

    display(drawContext: DrawContext) {
        var x = this.properties.location.x + this.shape.offset.x;
        var y = this.properties.location.y + this.shape.offset.y;
        drawContext.drawP(x, y, this.shape.points);
        drawContext.fill();
    }
}

export class PolyGraphic implements IView {
    constructor(private properties: ILocated, private shape: ShapeData, private graphic: GraphicData) { }

    display(drawContext: DrawContext) {
        if (this.graphic.loaded) {
            var x = this.properties.location.x + this.shape.offset.x;
            var y = this.properties.location.y + this.shape.offset.y;
            drawContext.drawP(x, y, this.shape.points);
            drawContext.save();
            let fillStyle: CanvasPattern = drawContext.createPattern(this.graphic.img);
            drawContext.fill(fillStyle);
            drawContext.restore();
        }
    }
}

export class PolyGraphicAngled implements IView {
    constructor(private properties: ILocatedAngled, private shape: ShapeData, private graphic: GraphicData) { }

    display(drawContext: DrawContext) {
        if (this.graphic.loaded) {
            var x = this.properties.location.x + this.shape.offset.x;
            var y = this.properties.location.y + this.shape.offset.y;
            drawContext.drawP(x, y, this.shape.points);
            drawContext.save();
            drawContext.translate(this.properties.location.x, this.properties.location.y);
            drawContext.rotate(this.properties.angle);
            let fillStyle: CanvasPattern = drawContext.createPattern(this.graphic.img);
            drawContext.fill(fillStyle);
            drawContext.restore();
        }
    }
}

