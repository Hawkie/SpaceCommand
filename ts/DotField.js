define(["require", "exports", "./Common/Coordinate"], function (require, exports, Coordinate_1) {
    "use strict";
    var DotField = (function () {
        function DotField(startx, starty, velx, vely, sizex, sizey) {
            this.fieldObjects = [];
            this.startx = startx;
            this.starty = starty;
            this.velx = velx;
            this.vely = vely;
            this.sizex = sizex;
            this.sizey = sizey;
        }
        DotField.prototype.update = function (lastDrawModifier) {
            /// TODO: use distribution pattern for start instead of absolute x,y (canvas size
            var o = new Coordinate_1.Coordinate(Math.random() * 512, this.starty);
            this.fieldObjects.push(o);
            // move objects
            this.fieldObjects.forEach(function (element) {
                element.x -= this.velx * lastDrawModifier;
                element.y -= this.vely * lastDrawModifier;
            }, this);
        };
        DotField.prototype.display = function (drawingContext) {
            //drawingContext.rotateat(0,0, 1 * this.fieldObjects.length);
            this.fieldObjects.forEach(function (element) {
                drawingContext.drawRect(element.x, element.y, this.sizex, this.sizey);
            }, this);
            //drawingContext.rotateat(0,0,-1 * this.fieldObjects.length);
        };
        return DotField;
    }());
    exports.DotField = DotField;
});
//# sourceMappingURL=DotField.js.map