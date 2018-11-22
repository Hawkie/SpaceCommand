import { Coordinate, ICoordinate } from "../../../../src/ts/gamelib/DataTypes/Coordinate";

export class DrawContext {
    constructor(private ctx: CanvasRenderingContext2D) {
        this.ctx.strokeStyle = "#fff";
        this.ctx.fillStyle = "#fff";
    }

    zoom(scaleX:number, scaleY:number): void {
        let ctx: CanvasRenderingContext2D = this.ctx;
        ctx.scale(scaleX, scaleY);
    }

    save(): void {
        this.ctx.save();
        // the current transformation matrix.
        // the current clipping region.
        // the current values of the following attributes: strokeStyle, fillStyle, globalAlpha,
        // lineWidth, lineCap, lineJoin, miterLimit, shadowOffsetX, shadowOffsetY, shadowBlur,
        // shadowColor, globalCompositeOperation, font, textAlign, textBaseline.
    }

    restore(): void {
        this.ctx.restore();
    }

    fill(fillStyle: any = "#111"): void {
        let ctx: CanvasRenderingContext2D = this.ctx;
        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.fill();
        ctx.restore();
    }

    line(xFrom: number, yFrom: number, xTo: number, yTo: number): void {
        let ctx: CanvasRenderingContext2D = this.ctx;
        ctx.beginPath();
        ctx.moveTo(xFrom, yFrom);
        ctx.lineTo(xTo, yTo);
        ctx.closePath();
        ctx.stroke();
    }

    drawP(x: number, y:number, points: ReadonlyArray<Coordinate>): void {
        let ctx: CanvasRenderingContext2D = this.ctx;
        // iterate thru all points and draw with stroke style
        if (points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(points[0].x + x, points[0].y + y);
            for (let i:number = 1, len:number = points.length; i < len; i ++) {
                ctx.lineTo(points[i].x + x, points[i].y + y);
            }
            ctx.closePath();
            ctx.stroke();
        }
    }

    drawImage(img: HTMLImageElement, x: number, y: number): void {
        this.ctx.drawImage(img, x, y);
    }

    createPattern(img: HTMLImageElement): CanvasPattern {
        return this.ctx.createPattern(img, "repeat");
        // repeat	Default.The pattern repeats both horizontally and vertically	Play it �
        // repeat - x	The pattern repeats only horizontally	Play it �
        // repeat - y	The pattern repeats only vertically	Play it �
        // no - repeat	The pattern will be displayed only once (no repeat)
    }

    creatGradient(x0: number, y0: number, x1:number, y1:number): CanvasGradient {
        return this.ctx.createLinearGradient(x0, y0, x1, y1);
        // let grd = ctx.createLinearGradient(0, 0, 200, 200);
        // grd.addColorStop(0, "black");
        // grd.addColorStop(0.1, "#5f3");
        // grd.addColorStop(1, "#f45");
    }

    drawSprite(img: HTMLImageElement,
        spriteX: number,
        spriteY: number,
        spriteW:number,
        spriteH:number,
        x: number,
        y: number,
        screenWidth:number,
        screenHeight: number): void {
        this.ctx.drawImage(img, spriteX, spriteY, spriteW, spriteH, x, y, screenWidth, screenHeight);
     }

    drawText(x : number, y : number, text : string, fontSize : number, font : string): void {
        this.ctx.font = String(fontSize) + "px " + font;
        this.ctx.fillText(text, x, y);
    }

    fillRect(x : number, y : number, w : number, h : number): void {
        this.ctx.fillRect(x, y, w, h);
    }

    drawCircle(x: number, y: number, radius: number): void {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    translate(x: number, y: number): void {
        this.ctx.translate(x, y);
    }

    // pi = 180 degrees.
    rotate(degrees: number): void {
        // rotate 45 degrees clockwise degrees/360 * PI *2
        this.ctx.rotate(degrees / 180 * Math.PI);
    }

    clear(): void {
        let ctx: CanvasRenderingContext2D = this.ctx;
        let l: number = ctx.canvas.clientLeft;
        let t: number = ctx.canvas.clientTop;
        let w: number = ctx.canvas.clientWidth;
        let h: number = ctx.canvas.clientHeight;
        ctx.clearRect(l, t, w, h);
    }
}