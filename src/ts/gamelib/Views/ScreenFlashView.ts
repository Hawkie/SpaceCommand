
import { IView } from "./../../gamelib/Views/View";
import { DrawContext } from "../../gamelib/1Common/DrawContext";

export interface IScreenFlashInputs {
    x: number;
    y: number;
    width: number;
    height: number;
    on: boolean;
    value: number;
}

// 512, 480
export class ScreenFlashView implements IView {
    constructor(private getInputs: ()=> IScreenFlashInputs) {}

    display(drawContext: DrawContext): void {
        let inputs: IScreenFlashInputs = this.getInputs();
        if (inputs.on) {
            if (inputs.value === 1) {
                drawContext.fillRect(inputs.x,
                    inputs.y,
                    inputs.width,
                    inputs.height);
                drawContext.fill();
            }
        }
    }
}