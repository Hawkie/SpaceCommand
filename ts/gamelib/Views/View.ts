import { DrawContext } from "ts/gamelib/Common/DrawContext";

export interface IView {
    display(drawContext: DrawContext): void;
}