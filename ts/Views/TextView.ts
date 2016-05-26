import { IView } from "ts/Views/PolyViews";
import { Coordinate } from "ts/Physics/Common";
import { DrawContext } from "ts/Common/DrawContext";
import { ITextData, TextData, IValueData, ValueData } from "ts/Models/TextModel";

export class TextView implements IView {
    constructor(private model: ITextData, private font: string, private fontSize: number){
    }
       
    display(drawingContext : DrawContext){
        drawingContext.drawText(this.model.location.x, this.model.location.y, this.model.text, this.fontSize, this.font);
    }
}

export class ValueView implements IView {
    constructor(public model: IValueData, private format: string, private font: string, private fontSize: number) {
    }

    display(drawingContext: DrawContext) {
        drawingContext.drawText(this.model.location.x, this.model.location.y, this.model.value.toString(), this.fontSize, this.font);
    }
}
