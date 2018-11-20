import { DrawContext } from "../../../../src/ts/gamelib/1Common/DrawContext";

export function DrawNumber(ctx: DrawContext, x: number, y: number, n: number, font: string, fontSize: number): void {
    ctx.drawText(x, y, n.toString(), fontSize, font);
}