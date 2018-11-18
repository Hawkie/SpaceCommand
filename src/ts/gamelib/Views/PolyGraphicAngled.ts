import { DrawContext } from "../1Common/DrawContext";
import { IView } from "../Views/View";
import { IGraphic, Graphic } from "../Elements/Graphic";
import { IPolyGraphicView } from "./PolyGraphic";
import { IShape } from "../DataTypes/Shape";

export interface IPolyGraphicAngledView extends IPolyGraphicView {
    angle: number;
}

export class PolyGraphicAngledView implements IView {
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

export function DrawPolyGraphicAngled(ctx: DrawContext, x:number, y: number, shape: IShape, angle: number, graphic: IGraphic): void {
    if (graphic.loaded) {
        ctx.drawP(x, y, shape.points);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        let fillStyle: CanvasPattern = ctx.createPattern(graphic.img);
        ctx.fill(fillStyle);
        ctx.restore();
    }
}