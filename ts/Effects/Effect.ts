import { DrawContext } from "../Common/DrawContext";

export interface IEffect {
    display(drawContext: DrawContext);
}