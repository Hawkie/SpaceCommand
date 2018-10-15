import { DrawContext } from "ts/gamelib/Common/DrawContext";
import { IView } from "ts/gamelib/Views/View";
import { ICircleView } from "./ICircleView";
export class CircleView implements IView {
    constructor(private getInputs: () => ICircleView) {
    }
    display(drawContext: DrawContext): void {
        var circle: ICircleView = this.getInputs();
        drawContext.drawCircle(circle.x, circle.y, circle.r);
    }
}