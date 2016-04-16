define(["require", "exports", "./DrawContext"], function (require, exports, DrawContext_1) {
    "use strict";
    var Canvas = (function () {
        function Canvas(width, height, document) {
            this.canvas = document.createElement("canvas");
            this.canvas.width = width;
            this.canvas.height = height;
            this.ctx = this.canvas.getContext("2d");
            this.c = new DrawContext_1.DrawContext(this.ctx);
            document.body.appendChild(this.canvas);
        }
        Canvas.prototype.context = function () {
            return this.c;
        };
        Canvas.prototype.doSomething = function () { };
        return Canvas;
    }());
    exports.Canvas = Canvas;
});
//# sourceMappingURL=Canvas.js.map