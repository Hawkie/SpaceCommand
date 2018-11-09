import { DrawContext } from "../../gamelib/1Common/DrawContext";
import { IView } from "../../gamelib/Views/View";

export interface ICircleView {
    x: number;
    y: number;
    r: number;
}

export class CircleView implements IView {
    constructor(private getInputs: () => ICircleView) {
    }
    display(drawContext: DrawContext): void {
        let circle: ICircleView = this.getInputs();
        drawContext.drawCircle(circle.x, circle.y, circle.r);
    }
}

export function DisplayCircle(drawContext: DrawContext, x: number, y: number, r: number): void {
    drawContext.drawCircle(x, y, r);
}