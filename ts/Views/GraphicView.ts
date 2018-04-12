import { DrawContext } from "ts/Common/DrawContext";
import { ILocated, IAngled, ILocatedAngled } from "ts/Data/PhysicsData";
import { IGraphic, GraphicData } from "ts/Data/GraphicData";
import { IView } from "ts/Views/View";

export interface IGraphicViewInputs {
    x: number;
    y: number;
    graphic: IGraphic;
}

// binds data object to drawable item
export class GraphicView implements IView {
    constructor(private getInputs: ()=> IGraphicViewInputs) { }

    display(drawContext: DrawContext): void {
        var inputs: IGraphicViewInputs = this.getInputs();
        GraphicView.drawGraphic(drawContext, inputs);
    }

    static drawGraphic(drawContext: DrawContext, inputs: IGraphicViewInputs): void {
        if (inputs.graphic.loaded) {
            drawContext.drawImage(inputs.graphic.img, inputs.x, inputs.y);
        }
    }
}

export interface IGraphicAngledViewInputs extends IGraphicViewInputs {
    angle: number;
}

// TODO: fix the rotation as per sprite rotation adjustment of origin
export class GraphicAngledView implements IView {
    constructor(private getInputs: ()=> IGraphicAngledViewInputs) { }

    display(drawContext: DrawContext): void {
        var inputs: IGraphicAngledViewInputs = this.getInputs();
        if (inputs.graphic.loaded) {
            drawContext.save();
            drawContext.translate(inputs.x, inputs.y);
            drawContext.rotate(inputs.angle);
            drawContext.translate(-inputs.x, -inputs.y);
            GraphicView.drawGraphic(drawContext, inputs);
            drawContext.restore();
        }
    }
}

