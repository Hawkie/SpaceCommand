import { DrawContext } from "../../gamelib/1Common/DrawContext";

export function DrawFlash(ctx: DrawContext, x: number, y: number, width: number, height: number, value: number): void {
    if (value === 1) {
        ctx.fillRect(x,
            y,
            width,
            height);
        ctx.fill();
    }
}