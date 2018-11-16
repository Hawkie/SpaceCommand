import { IView } from "../../../../src/ts/gamelib/Views/View";
import { ICoordinate } from "../../../../src/ts/gamelib/DataTypes/Coordinate";
import { DrawContext } from "../../../../src/ts/gamelib/1Common/DrawContext";

export class ValueView implements IView {
    constructor(public getModel: ()=> number,
        private location: ICoordinate,
        private font: string,
        private fontSize: number) {
    }

    display(drawingContext: DrawContext): void {
        let value: number = this.getModel();
        drawingContext.drawText(this.location.x,
            this.location.y,
            value.toString(),
            this.fontSize,
            this.font);
    }
}

export function DrawNumber(ctx: DrawContext, x: number, y: number, n: number, font: string, fontSize: number): void {
    ctx.drawText(x, y, n.toString(), fontSize, font);
}