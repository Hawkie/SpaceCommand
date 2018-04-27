import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate } from "ts/Data/Coordinate";
// import { ILocated, ILocatedAngled } from "ts/Data/PhysicsData";
import { IShape } from "ts/Data/Shape";
import { IView } from "ts/Views/View";
import { IGraphic, Graphic } from "ts/Data/Graphic";

export interface IRectangleView {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class RectangleView implements IView {
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

export interface IPolyView {
    x: number;
    y: number;
    shape: IShape;
}

export class PolyView implements IView {
    constructor(private getInputs:()=> IPolyView) { }

    display(drawContext: DrawContext): void {
        var inputs: IPolyView = this.getInputs();
        var x: number = inputs.x + inputs.shape.offset.x;
        var y: number = inputs.y + inputs.shape.offset.y;
        drawContext.drawP(x, y, inputs.shape.points);
        drawContext.fill();
    }
}

export interface IPolyGraphicView extends IPolyView {
    graphic: string;
}

export class PolyGraphic implements IView {
    private graphic: IGraphic;
    constructor(private getInputs: ()=> IPolyGraphicView) {
        this.graphic = new Graphic(getInputs().graphic);
     }

    display(drawContext: DrawContext): void {
        var inputs: IPolyGraphicView = this.getInputs();
        if (this.graphic.loaded) {
            var x: number = inputs.x + inputs.shape.offset.x;
            var y: number = inputs.y + inputs.shape.offset.y;
            drawContext.drawP(x, y, inputs.shape.points);
            drawContext.save();
            let fillStyle: CanvasPattern = drawContext.createPattern(this.graphic.img);
            drawContext.fill(fillStyle);
            drawContext.restore();
        }
    }
}

export interface IPolyGraphicAngledView extends IPolyGraphicView {
    angle: number;
}

export class PolyGraphicAngled implements IView {
    private graphic: IGraphic;
    constructor(private getInputs: ()=> IPolyGraphicAngledView) {
        this.graphic = new Graphic(getInputs().graphic);
     }

    display(drawContext: DrawContext): void {
        var inputs: IPolyGraphicAngledView = this.getInputs();
        if (this.graphic.loaded) {
            var x: number = inputs.x + inputs.shape.offset.x;
            var y: number = inputs.y + inputs.shape.offset.y;
            drawContext.drawP(x, y, inputs.shape.points);
            drawContext.save();
            drawContext.translate(inputs.x, inputs.y);
            drawContext.rotate(inputs.angle);
            let fillStyle: CanvasPattern = drawContext.createPattern(this.graphic.img);
            drawContext.fill(fillStyle);
            drawContext.restore();
        }
    }
}

