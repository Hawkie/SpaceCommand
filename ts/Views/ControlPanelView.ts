import { Coordinate } from "ts/Physics/Common";
import { DrawContext } from "ts/Common/DrawContext";
import { IView } from "ts/Views/View";
import { IControlPanelModel, ControlPanelModel, ISlider, Slider } from "ts/Models/Controls/ControlPanelModel";

export class ControlPanelView implements IView {

    sliders: SliderView[];
    constructor(private model: IControlPanelModel, private location: Coordinate, private width: number) {
        this.sliders = [];
        this.model.sliders.forEach((control, index) => {
            let sliderLocation = new Coordinate(location.x, location.y + index * 20);
            this.sliders.push(new SliderView(control, sliderLocation, width));
        });
    }


    display(drawContext: DrawContext) {
        this.sliders.forEach(slider => slider.display(drawContext));

        // draw selector
        drawContext.fillRect(this.location.x, this.location.y + this.model.selectedControl * 20, 5, 5);
    }
}

export class SliderView implements IView {
    constructor(private model: Slider, private location: Coordinate, private width: number, private fontSize: number = 10, private font: string = "monospace") {
    }

    display(drawContext: DrawContext) {
        var factor = this.model.value / (this.model.max - this.model.min);
        
        if (this.model.enabled) {
            drawContext.fillRect(this.location.x + 10, this.location.y, 2, 2);
        }
        drawContext.drawText(this.location.x+20, this.location.y+this.fontSize, this.model.name, this.fontSize, this.font);
        
        drawContext.fillRect(this.location.x + 140, this.location.y, this.width * factor, 10);
        drawContext.drawText(this.location.x + 160 + this.width, this.location.y + this.fontSize, this.model.value.toString(), this.fontSize, this.font);
        
    }
}