import { DrawContext } from "ts/gamelib/1Common/DrawContext";
import { IView } from "ts/gamelib/Views/View";
import { IGraphic, Graphic } from "ts/gamelib/Data/Graphic";
import { IPolyGraphicView } from "./PolyGraphic";

export interface IPolyGraphicAngledView extends IPolyGraphicView {
    angle: number;
}

export class PolyGraphicAngled implements IView {
    private graphic: IGraphic;
    constructor(private getInputs: () => IPolyGraphicAngledView) {
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