define(["require", "exports"], function (require, exports) {
    "use strict";
    var Polygon = (function () {
        function Polygon(points) {
            this.points = points;
        }
        Polygon.prototype.hasPoint = function (location, testPoint) {
            var c = false;
            for (var i = 0, j = this.points.length - 1; i < this.points.length; i += 1) {
                var px1 = this.points[i].x + location.x;
                var px2 = this.points[j].x + location.x;
                var py1 = this.points[i].y + location.y;
                var py2 = this.points[j].y + location.y;
                if ((py1 > testPoint.y != py2 > testPoint.y) &&
                    (testPoint.x < (px2 - px1) * (testPoint.y - py1) / (py2 - py1) + px1)) {
                    c = !c;
                }
                j = i;
            }
            return c;
        };
        Polygon.prototype.hasPoin = function (ox, oy, x, y) {
            var c = false;
            var p = this.points;
            var len = p.length;
            // doing magic!
            for (var i = 0, j = len - 2; i < len; i += 2) {
                var px1 = p[i] + ox;
                var px2 = p[j] + ox;
                var py1 = p[i + 1] + oy;
                var py2 = p[j + 1] + oy;
                if ((py1 > y != py2 > y) &&
                    (x < (px2 - px1) * (y - py1) / (py2 - py1) + px1)) {
                    c = !c;
                }
                j = i;
            }
            return c;
        };
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