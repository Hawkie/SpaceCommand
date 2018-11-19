import { DrawContext } from "../../../ts/gamelib/1Common/DrawContext";

export function DrawLine(ctx: DrawContext, xFrom:number, yFrom: number, xTo: number, yTo: number): void {
    ctx.line(xFrom, yFrom, xTo, yTo);
}