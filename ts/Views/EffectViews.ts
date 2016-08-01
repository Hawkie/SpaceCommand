
import { IView } from "ts/Views/View";
import { DrawContext } from "ts/Common/DrawContext";
import { EffectData } from "ts/Data/EffectData";
import { ILocated } from "ts/Data/PhysicsData";

export class ScreenFlashView implements IView {
    constructor(private located:ILocated, private effect: EffectData) {
    }

    display(drawContext: DrawContext) {
        if (this.effect.enabled) {
            if (this.effect.value) {
                drawContext.fillRect(this.located.location.x, this.located.location.y, 512, 480);
                drawContext.fill();
            }
        }
    }
}