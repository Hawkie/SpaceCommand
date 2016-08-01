import { Coordinate } from "ts/Physics/Common";

export class DrawContext {
    constructor(private ctx: CanvasRenderingContext2D) {
        this.ctx.strokeStyle = "#fff";
        this.ctx.fillStyle = "#fff";
    }

    zoom(scaleX:number, scaleY:number) {
        var ctx = this.ctx;
        ctx.scale(scaleX, scaleY);
    }

    save() {
        this.ctx.save();
        //* The current transformation matrix.
        //* The current clipping region.
        //* The current values of the following attributes: strokeStyle, fillStyle, globalAlpha, lineWidth, lineCap, lineJoin, miterLimit, shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor, globalCompositeOperation, font, textAlign, textBaseline.
    }

    restore() {
        this.ctx.restore();
    }

    fill(fillStyle: any = "#111") {
        var ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.fill();
        ctx.restore();
    }

    drawP(location: Coordinate, points: Coordinate[]) {
        var ctx = this.ctx;
        var p = points;
        // iterate thru all points and draw with stroke style
        if (points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(points[0].x + location.x, points[0].y + location.y);
            for (var i = 1, len = p.length; i < len; i ++) {
                ctx.lineTo(p[i].x + location.x, p[i].y + location.y);
            }
            ctx.closePath();
            ctx.stroke();
        }
    }

    drawImage(img: HTMLImageElement, x, y) {
        this.ctx.drawImage(img, x, y);
    }

    createPattern(img: HTMLImageElement) : CanvasPattern {
        return this.ctx.createPattern(img, 'repeat');
        //repeat	Default.The pattern repeats both horizontally and vertically	Play it »
        //repeat - x	The pattern repeats only horizontally	Play it »
        //repeat - y	The pattern repeats only vertically	Play it »
        //no - repeat	The pattern will be displayed only once (no repeat)
    }

    creatGradient(x0: number, y0: number, x1:number, y1:number) : CanvasGradient {
        return this.ctx.createLinearGradient(x0, y0, x1, y1);
        //var grd = ctx.createLinearGradient(0, 0, 200, 200);
        //grd.addColorStop(0, "black");
        //grd.addColorStop(0.1, "#5f3");
        //grd.addColorStop(1, "#f45");
    }

    drawSprite(img: HTMLImageElement, spriteX: number, spriteY: number, spriteW:number, spriteH:number, x: number, y: number, screenWidth:number, screenHeight: number) {
         this.ctx.drawImage(img, spriteX, spriteY, spriteW, spriteH, x, y, screenWidth, screenHeight)
     }

    drawText(x : number, y : number, text : string, fontSize : number, font : string) {
        this.ctx.font = String(fontSize) + "px " + font;
        this.ctx.fillText(text, x, y);
    }

    fillRect(x : number, y : number, w : number, h : number) {
        this.ctx.fillRect(x, y, w, h);
    }

    drawCircle(x: number, y: number, radius: number) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    translate(x: number, y: number) {
        this.ctx.translate(x, y);
    }

    // PI = 180 degrees.
    rotate(degrees: number) {
        // rotate 45 degrees clockwise degrees/360 * PI *2
        this.ctx.rotate(degrees / 360 * Math.PI * 2);
    }

    clear() {
        var ctx = this.ctx;
        var l = ctx.canvas.clientLeft;
        var t = ctx.canvas.clientTop;
        var w = ctx.canvas.clientWidth;
        var h = ctx.canvas.clientHeight;
        ctx.clearRect(l, t, w, h);
    }
}