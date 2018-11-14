import { IView } from "../../../../src/ts/gamelib/Views/View";
import { Coordinate, ICoordinate } from "../../../../src/ts/gamelib/DataTypes/Coordinate";
import { DrawContext } from "../../../../src/ts/gamelib/1Common/DrawContext";



export class TextView implements IView {
    constructor(private model: ()=> string,
        private location: ICoordinate,
        private font: string,
        private fontSize: number) {
    }

    display(drawingContext : DrawContext): void {
        drawingContext.drawText(this.location.x,
            this.location.y,
            this.model(),
            this.fontSize,
            this.font);
    }
}

export function DrawText(ctx: DrawContext, x: number, y: number, text: string, font: string, fontSize: number): void {
    ctx.drawText(x,
        y,
        text,
        fontSize,
        font);
}
