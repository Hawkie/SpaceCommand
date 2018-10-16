import { DrawContext } from "ts/gamelib/1Common/DrawContext";
import { IView } from "ts/gamelib/Views/View";
import { IRectangleView } from "./IRectangleView";
export class RectangleView implements IView {
    constructor(private getIn: () => IRectangleView) {
    }
    display(drawContext: DrawContext): void {
        var rectangle: IRectangleView = this.getIn();
        drawContext.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    }
}