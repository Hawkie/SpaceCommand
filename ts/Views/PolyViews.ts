import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate } from "ts/Physics/Common";
import { ILocated, ILocatedAngled } from "ts/Data/PhysicsData";
import { IShape, ShapeData, RectangleData } from "ts/Data/ShapeData";
import { IView } from "ts/Views/View";
import { IGraphic, GraphicData } from "ts/Data/GraphicData";

export interface IRectangleView {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class RectangleView2 implements IView {
    constructor(private getIn: ()=> IRectangleView) {
    }

    display(drawContext: DrawContext): void {
        var rectangle: IRectangleView =this.getIn();
        drawContext.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
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

export interface ILineView {
    xFrom: number;
    yFrom: number;
    xTo: number;
    yTo: number;
}

export class LineView implements IView {
    constructor(private getIn: ()=> ILineView) {
    }

    display(drawContext: DrawContext): void {
        var line: ILineView = this.getIn();
        drawContext.line(line.xFrom, line.yFrom, line.xTo, line.yTo);
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

