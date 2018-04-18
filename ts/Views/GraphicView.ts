import { DrawContext } from "ts/Common/DrawContext";
import { ILocated, IAngled, ILocatedAngled } from "ts/Data/PhysicsData";
import { IGraphic, GraphicData } from "ts/Data/GraphicData";
import { IView } from "ts/Views/View";

export interface IGraphicViewInputs {
    x: number;
    y: number;
    graphic: string;
}

// binds data object to drawable item
export class GraphicView implements IView {
    private graphic: IGraphic;
    constructor(private getInputs: ()=> IGraphicViewInputs) {
        this.graphic = new GraphicData(getInputs().graphic);
     }

    display(drawContext: DrawContext): void {
        var inputs: IGraphicViewInputs = this.getInputs();
        if (this.graphic.loaded) {
            drawContext.drawImage(this.graphic.img, inputs.x, inputs.y);
        }
    }
}

export interface IGraphicAngledViewInputs extends IGraphicViewInputs {
    angle: number;
}

// tODO: fix the rotation as per sprite rotation adjustment of origin
export class GraphicAngledView implements IView {
    private graphic: IGraphic;
    constructor(private getInputs: ()=> IGraphicAngledViewInputs) {
        this.graphic = new GraphicData(getInputs().graphic);
     }

    display(drawContext: DrawContext): void {
        var inputs: IGraphicAngledViewInputs = this.getInputs();
        if (this.graphic.loaded) {
            drawContext.save();
            drawContext.translate(inputs.x, inputs.y);
            drawContext.rotate(inputs.angle);
            drawContext.translate(-inputs.x, -inputs.y);
            if (this.graphic.loaded) {
                drawContext.drawImage(this.graphic.img, inputs.x, inputs.y);
            }
            drawContext.restore();
        }
    }
}

