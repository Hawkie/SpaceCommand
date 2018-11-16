import { DrawContext } from "../../gamelib/1Common/DrawContext";
import { DrawText } from "../../gamelib/Views/TextView";

// map title to text view
export function titleToView(ctx: DrawContext, title: string): void {
    DrawText(ctx, 10, 20, title, "Arial", 18);
}