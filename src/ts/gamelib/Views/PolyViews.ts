import { DrawContext } from "../../../ts/gamelib/1Common/DrawContext";
import { IShape } from "../../../ts/gamelib/DataTypes/Shape";

export function DrawPoly(ctx: DrawContext, x: number, y: number, shape: IShape): void {
    ctx.drawP(x, y, shape.points);
    ctx.fill();
}