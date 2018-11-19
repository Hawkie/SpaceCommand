import { DrawContext } from "../1Common/DrawContext";
import { IGraphic } from "../Elements/Graphic";
import { IShape } from "../DataTypes/Shape";

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