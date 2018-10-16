import { DrawContext } from "ts/gamelib/1Common/DrawContext";

export interface IView {
    display(drawContext: DrawContext): void;
}