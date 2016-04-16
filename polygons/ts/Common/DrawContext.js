define(["require", "exports"], function (require, exports) {
    "use strict";
    //import { Polygon } from "./DisplayObject";
    var DrawContext = (function () {
        function DrawContext(ctx) {
            this.ctx = ctx;
            this.ctx.strokeStyle = "#fff";
            this.ctx.fillStyle = "#fff";
        }
        DrawContext.prototype.drawP = function (location, points) {
            var ctx = this.ctx;
            var p = points;
            // iterate thru all points and draw with stroke style
            if (points.length > 0) {
                ctx.beginPath();
                ctx.moveTo(points[0].x + location.x, points[0].y + location.y);
                for (var i = 1, len = p.length; i < len; i++) {
                    ctx.lineTo(p[i].x + location.x, p[i].y + location.y);
                }
                ctx.stroke();
            }
        };
        DrawContext.prototype.drawImage = function (img, x, y) {
            this.ctx.drawImage(img, x, y);
        };
        // drawSprite(img, x, y, frame) {
        //     this.ctx.drawImage(img, spriteX, spriteY, spriteW, spriteH, x, y, screenWidth, screenHeight)
        // }
        DrawContext.prototype.drawRect = function (x, y, w, h) {
            this.ctx.fillRect(x, y, w, h);
        };
        DrawContext.prototype.translate = function (x, y) {
            this.ctx.translate(x, y);
        };
        // PI = 180 degrees.
        DrawContext.prototype.rotate = function (degrees) {
            // rotate 45 degrees clockwise degrees/360 * PI *2
            this.ctx.rotate(degrees / 360 * Math.PI * 2);
        };
        DrawContext.prototype.clear = function () {
            var ctx = this.ctx;
            ctx.clearRect(0, 0, 512, 480);
        };
        return DrawContext;
    }());
    exports.DrawContext = DrawContext;
});
//# sourceMappingURL=DrawContext.js.map