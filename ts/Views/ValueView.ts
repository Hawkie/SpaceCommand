import { IView } from "ts/Views/View";
import { Coordinate, ICoordinate } from "ts/gamelib/Data/Coordinate";
import { DrawContext } from "ts/Common/DrawContext";



export class ValueView implements IView {
    constructor(public getModel: ()=> number,
        private location: ICoordinate, private font: string, private fontSize: number) {
    }

    display(drawingContext: DrawContext): void {
        var value: number = this.getModel();
        drawingContext.drawText(this.location.x, this.location.y, value.toString(), this.fontSize, this.font);
    }
}