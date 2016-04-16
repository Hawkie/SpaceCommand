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
});
//# sourceMappingURL=DisplayObject.js.map