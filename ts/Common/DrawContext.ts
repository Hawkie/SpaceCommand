import { Coordinate } from "ts/Physics/Common";
//import { Polygon } from "./DisplayObject";

export class DrawContext {
    constructor(private ctx: CanvasRenderingContext2D) {
        this.ctx.strokeStyle = "#fff";
        this.ctx.fillStyle = "#fff";
    }

    zoom(scaleX:number, scaleY:number) {
        var ctx = this.ctx;
        ctx.scale(scaleX, scaleY);
    }

    drawP(location: Coordinate, points: Coordinate[]) {
        var ctx = this.ctx;
        //ctx.scale(2, 2);
        var p = points;
        let origFillStyle = ctx.fillStyle;
        ctx.fillStyle = "#111";
        // iterate thru all points and draw with stroke style
        if (points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(points[0].x + location.x, points[0].y + location.y);
            for (var i = 1, len = p.length; i < len; i ++) {
                ctx.lineTo(p[i].x + location.x, p[i].y + location.y);
            }
            ctx.stroke();
            ctx.fill();
        }
        //ctx.scale(0.5, 0.5);
        this.ctx.fillStyle = origFillStyle;
    }

    drawImage(img, x, y) {
        this.ctx.drawImage(img, x, y);
    }

    drawSprite(img: HTMLImageElement, spriteX: number, spriteY: number, spriteW:number, spriteH:number, x: number, y: number, screenWidth:number, screenHeight: number) {
         this.ctx.drawImage(img, spriteX, spriteY, spriteW, spriteH, x, y, screenWidth, screenHeight)
     }

    drawText(x : number, y : number, text : string, fontSize : number, font : string) {
        this.ctx.font = String(fontSize) + "px " + font;
        this.ctx.fillText(text, x, y);
    }

    drawRect(x : number, y : number, w : number, h : number) {
        this.ctx.fillRect(x, y, w, h);
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