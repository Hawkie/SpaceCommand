import { DrawContext } from "../../../ts/gamelib/1Common/DrawContext";
import { IGraphic, Graphic } from "../Elements/Graphic";
import { IView } from "../../../ts/gamelib/Views/View";

export interface IGraphicViewInputs {
    x: number;
    y: number;
    graphic: string;
}

// binds data object to drawable item
export class GraphicView implements IView {
    private graphic: IGraphic;
    constructor(private getInputs: ()=> IGraphicViewInputs) {
        this.graphic = new Graphic(getInputs().graphic);
     }

    display(drawContext: DrawContext): void {
        let inputs: IGraphicViewInputs = this.getInputs();
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
        this.graphic = new Graphic(getInputs().graphic);
     }

    display(drawContext: DrawContext): void {
        let inputs: IGraphicAngledViewInputs = this.getInputs();
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

export function DrawGraphic(ctx: DrawContext, x:number, y: number, graphic: IGraphic): void {
    if (graphic.loaded) {
        ctx.drawImage(graphic.img, x, y);
    }
}

export function DrawGraphicAngled(ctx: DrawContext, x:number, y: number, angle: number, graphic: IGraphic): void {
    if (graphic.loaded) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.translate(-x, -y);
        if (graphic.loaded) {
            ctx.drawImage(graphic.img, x, y);
        }
        ctx.restore();
    }
}
