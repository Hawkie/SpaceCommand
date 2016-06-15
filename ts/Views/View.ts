import { DrawContext } from "ts/Common/DrawContext";

export interface IView {
    display(drawContext: DrawContext);
}