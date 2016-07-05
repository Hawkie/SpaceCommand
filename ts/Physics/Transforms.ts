import { Coordinate, Vector } from "../Physics/Common";

export class Transforms {

    static random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static ArrayToPoints(array: number[]): Coordinate[] {
        let points: Coordinate[] = [];
        for (let i = 0; i < array.length - 1; i+=2){
            points.push(new Coordinate(array[i], array[i + 1]));
        }
        return points;
    }

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

    static CartesianToVector(x: number, y: number) : Vector {
        var length = Math.sqrt(x * x + y * y);
        var angle = Math.atan(y / x) * 180 / Math.PI;
        return new Vector(angle, length);
    }

    static scale(points: Coordinate[], scaleX: number, scaleY:number) {
        points.forEach(p => { p.x *= scaleX; p.y *= scaleY; });
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