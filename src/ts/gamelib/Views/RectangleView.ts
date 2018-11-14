import { DrawContext } from "../1Common/DrawContext";
import { IView } from "../Views/View";

export interface IRectangleView {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class RectangleView implements IView {
    constructor(private getIn: () => IRectangleView) {
    }
    display(drawContext: DrawContext): void {
        let rectangle: IRectangleView = this.getIn();
        drawContext.fillRect(rectangle.x,
            rectangle.y,
            rectangle.width,
            rectangle.height);
    }
}

export function DisplayRectangle(drawContext: DrawContext,
    x: number,
    y: number,
    width: number,
    height: number): void {
        drawContext.fillRect(x,
            y,
            width,
            height);
}