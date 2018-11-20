import { DrawContext } from "../../../../src/ts/gamelib/1Common/DrawContext";

export function DrawText(ctx: DrawContext, x: number, y: number, text: string, font: string, fontSize: number): void {
    ctx.drawText(x,
        y,
        text,
        fontSize,
        font);
}
