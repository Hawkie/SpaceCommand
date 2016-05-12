import { Coordinate } from "../Physics/Common";

export class Transforms {
    static Rotate(points: Coordinate[], degrees: number): Coordinate[]{
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



    // https://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    static hasPoint(points: Coordinate[], startingLocation: Coordinate, testPoint: Coordinate): boolean {
        var c = false;
        for (var i = 0, j = points.length - 1; i < points.length; i += 1) {
            var px1 = points[i].x + startingLocation.x;
            var px2 = points[j].x + startingLocation.x;
            var py1 = points[i].y + startingLocation.y;
            var py2 = points[j].y + startingLocation.y;
            if ((py1 > testPoint.y !== py2 > testPoint.y) &&
                (testPoint.x < (px2 - px1) * (testPoint.y - py1) / (py2 - py1) + px1)
            ) {
                c = !c;
            }
            j = i;
        }
        return c;
    }

}