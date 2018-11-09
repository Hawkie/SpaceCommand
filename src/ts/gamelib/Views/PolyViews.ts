import { DrawContext } from "../../../ts/gamelib/1Common/DrawContext";
import { IShape } from "../../../ts/gamelib/DataTypes/Shape";
import { IView } from "../../../ts/gamelib/Views/View";

export interface IPolyView {
    x: number;
    y: number;
    shape: IShape;
}

export class PolyView implements IView {
    constructor(private getInputs:()=> IPolyView) { }

    display(drawContext: DrawContext): void {
        let inputs: IPolyView = this.getInputs();
        let x: number = inputs.x + inputs.shape.offset.x;
        let y: number = inputs.y + inputs.shape.offset.y;
        drawContext.drawP(x, y, inputs.shape.points);
        drawContext.fill();
    }
}


