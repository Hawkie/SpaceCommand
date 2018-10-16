import { DrawContext } from "ts/gamelib/1Common/DrawContext";
import { IView } from "ts/gamelib/Views/View";
import { IGraphic, Graphic } from "ts/gamelib/Data/Graphic";
import { IPolyGraphicView } from "./IPolyGraphicView";
export class PolyGraphic implements IView {
    private graphic: IGraphic;
    constructor(private getInputs: () => IPolyGraphicView) {
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