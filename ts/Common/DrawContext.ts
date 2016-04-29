import { Coordinate } from "./Coordinate";
//import { Polygon } from "./DisplayObject";

export class DrawContext {
    ctx: any;
    constructor(ctx) {
        this.ctx = ctx;
        this.ctx.strokeStyle = "#fff";
        this.ctx.fillStyle = "#fff";
    }

    drawP(location: Coordinate, points: Coordinate[]) {
        var ctx = this.ctx;
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
        this.ctx.fillStyle = origFillStyle;
    }

    drawImage(img, x, y) {
        this.ctx.drawImage(img, x, y);
    }

    // drawSprite(img, x, y, frame) {
    //     this.ctx.drawImage(img, spriteX, spriteY, spriteW, spriteH, x, y, screenWidth, screenHeight)
    // }

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
        ctx.clearRect(0, 0, 512, 480);
    }
}