import { DrawContext } from "../../../../src/ts/gamelib/1Common/DrawContext";

export interface IView {
    display(drawContext: DrawContext): void;
}