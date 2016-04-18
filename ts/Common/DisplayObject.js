define(["require", "exports"], function (require, exports) {
    "use strict";
    var Polygon = (function () {
        function Polygon(points) {
            this.points = points;
        }
        // method invoking basic methods on drawcontext
        Polygon.prototype.draw = function (location, drawingContext) {
            drawingContext.drawP(location, this.points);
        };
        return Polygon;
    }());
    exports.Polygon = Polygon;
    var Rect = (function () {
        function Rect(sizeX, sizeY) {
            this.sizeX = sizeX;
            this.sizeY = sizeY;
        }
        Rect.prototype.draw = function (location, drawingContext) {
            drawingContext.drawRect(location.x, location.y, this.sizeX, this.sizeY);
        };
        return Rect;
    }());
    exports.Rect = Rect;
});
//# sourceMappingURL=DisplayObject.js.map