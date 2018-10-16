import { IView } from "ts/gamelib/Views/View";
import { Coordinate, ICoordinate } from "ts/gamelib/Data/Coordinate";
import { DrawContext } from "ts/gamelib/1Common/DrawContext";



export class TextView implements IView {
    constructor(private model: ()=> string,
        private location: ICoordinate, private font: string, private fontSize: number) {
    }

    display(drawingContext : DrawContext): void {
        drawingContext.drawText(this.location.x, this.location.y, this.model(), this.fontSize, this.font);
    }
}
