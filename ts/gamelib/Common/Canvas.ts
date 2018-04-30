
import { DrawContext } from "ts/gamelib/Common/DrawContext";

export class Canvas {
    canvas : any;
    ctx : any;
    c : DrawContext;
    constructor(width : number, height : number, document : any) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");
        this.c = new DrawContext(this.ctx);
        document.body.appendChild(this.canvas);
    }

    public context(): DrawContext {
        return this.c;
    }
}