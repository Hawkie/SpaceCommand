import { DrawContext } from "../1Common/DrawContext";

export function DrawRectangle(drawContext: DrawContext,
    x: number,
    y: number,
    width: number,
    height: number): void {
        drawContext.fillRect(x,
            y,
            width,
            height);
}