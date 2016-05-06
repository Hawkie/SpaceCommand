import { Coordinate } from "./Coordinate";

export class Transforms {
    static rotate(points: Coordinate[], degrees: number): Coordinate[]{
        var radians = degrees / 360 * Math.PI * 2;
        // simplifying computition of 2x2 matrix
        // for more information see slides in part 1
        var c = Math.cos(radians);
        var s = Math.sin(radians);

        var newCoordinates = new Array<Coordinate>();
        // iterate thru each vertex and change position
        for (var i = 0; i < points.length; i++) {
            var x = c * points[i].x - s * points[i].y;
            var y = s * points[i].x + c * points[i].y;
            var newCoordinate = new Coordinate(x, y);
            newCoordinates.push(newCoordinate);
        }
        return newCoordinates;
    }

    static VectorToCartesian(degrees, length): Coordinate {
        var radians = degrees / 360 * Math.PI * 2;
        var x = Math.sin(radians) * length;
        var y = Math.cos(radians) * -length;
        return new Coordinate(x, y);
    }




}