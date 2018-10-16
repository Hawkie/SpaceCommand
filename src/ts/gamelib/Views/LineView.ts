import { DrawContext } from "ts/gamelib/1Common/DrawContext";
import { IView } from "ts/gamelib/Views/View";

export interface ILineView {
    xFrom: number;
    yFrom: number;
    xTo: number;
    yTo: number;
}

export class LineView implements IView {
    constructor(private getIn: () => ILineView) {
    }
    display(drawContext: DrawContext): void {
        var line: ILineView = this.getIn();
        drawContext.line(line.xFrom, line.yFrom, line.xTo, line.yTo);
    }
}