import { DrawContext } from "ts/gamelib/1Common/DrawContext";
import { IView } from "../Views/View";
import { IGraphic, Graphic } from "ts/gamelib/DataTypes/Graphic";
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
        let inputs: IPolyGraphicAngledView = this.getInputs();
        if (this.graphic.loaded) {
            let x: number = inputs.x + inputs.shape.offset.x;
            let y: number = inputs.y + inputs.shape.offset.y;
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