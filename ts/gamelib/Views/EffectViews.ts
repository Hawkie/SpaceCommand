
import { IView } from "ts/gamelib/Views/View";
import { DrawContext } from "ts/gamelib/Common/DrawContext";
import { IFlashInputs } from "./IFlashInputs";

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