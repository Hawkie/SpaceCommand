
import { IView } from "ts/gamelib/Views/View";
import { DrawContext } from "ts/Common/DrawContext";

export interface IFlashInputs {
    x: number;
    y: number;
    width: number;
    height: number;
    on: boolean;
    value: number;
}

// 512, 480
export class ScreenFlashView implements IView {
    constructor(private getInputs: ()=> IFlashInputs) {}

    display(drawContext: DrawContext): void {
        var inputs: IFlashInputs = this.getInputs();
        if (inputs.on) {
            if (inputs.value === 1) {
                drawContext.fillRect(inputs.x, inputs.y, inputs.width, inputs.height);
                drawContext.fill();
            }
        }
    }
}