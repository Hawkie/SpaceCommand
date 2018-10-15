import { DrawContext } from "ts/gamelib/Common/DrawContext";
import { Coordinate } from "ts/gamelib/Data/Coordinate";
// import { ILocated, ILocatedAngled } from "ts/gamelib/Data/PhysicsData";
import { IShape } from "ts/gamelib/Data/Shape";
import { IView } from "ts/gamelib/Views/View";

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


