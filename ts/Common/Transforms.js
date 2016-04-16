define(["require", "exports", "./Coordinate"], function (require, exports, Coordinate_1) {
    "use strict";
    var Transforms = (function () {
        function Transforms() {
        }
        Transforms.rotate = function (points, theta) {
            // simplifying computition of 2x2 matrix
            // for more information see slides in part 1
            var c = Math.cos(theta);
            var s = Math.sin(theta);
            var newCoordinates = new Array();
            // iterate thru each vertex and change position
            for (var i = 0, len = points.length; i < len; i++) {
                var x = c * points[i].x - s * points[i].y;
                var y = s * points[i].y + c * points[i].y;
                var newCoordinate = new Coordinate_1.Coordinate(x, y);
                newCoordinates.push(newCoordinate);
            }
            return newCoordinates;
        };
        Transforms.toVector = function (degrees, length) {
            var radians = degrees / 360 * Math.PI * 2;
            var x = Math.sin(radians) * length;
            var y = Math.cos(radians) * -length;
            return new Coordinate_1.Coordinate(x, y);
        };
        return Transforms;
    }());
    exports.Transforms = Transforms;
});
//# sourceMappingURL=Transforms.js.map