import { Coordinate, ICoordinate } from "ts/gamelib/Data/Coordinate";
import { Vector, IVector } from "ts/gamelib/Data/Vector";

export class Transforms {

    static random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static ArrayToPoints(array: number[]): Coordinate[] {
        let points: Coordinate[] = [];
        for (let i: number = 0; i < array.length - 1; i+=2) {
            points.push(new Coordinate(array[i], array[i + 1]));
        }
        return points;
    }

    static Rotate(points: Coordinate[], degrees: number): Coordinate[] {
        var radians: number = degrees / 180 * Math.PI;
        // simplifying computition of 2x2 matrix
        // for more information see slides in part 1
        var c:number = Math.cos(radians);
        var s:number = Math.sin(radians);

        var newCoordinates:ICoordinate[] = [];
        // iterate thru each vertex and change position
        for (var i:number = 0; i < points.length; i++) {
            var x: number = c * points[i].x - s * points[i].y;
            var y: number = s * points[i].x + c * points[i].y;
            var newCoordinate: ICoordinate = new Coordinate(x, y);
            newCoordinates.push(newCoordinate);
        }
        return newCoordinates;
    }

    static VectorToCartesian(degrees: number, length: number): Coordinate {
        var radians: number = degrees / 180 * Math.PI;
        var x: number = Math.sin(radians) * length; // sin 0 = 0
        var y: number = Math.cos(radians) * -length; // cos 0 = 1
        return new Coordinate(x, y);
    }

    // http://math.stackexchange.com/questions/1201337/finding-the-angle-between-two-points
    static CartesianToVector(x: number, y: number): IVector {
        var length: number = Math.sqrt(x * x + y * y);
        var angle: number = Math.atan2(x, y) * 180 / Math.PI;
        return new Vector(angle, length);
    }

    static scale(points: Coordinate[], scaleX: number, scaleY:number): void {
        points.forEach(p => { p.x *= scaleX; p.y *= scaleY; });
    }

    // https://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    static hasPoint(points: Coordinate[], startingLocation: Coordinate, testPoint: Coordinate): boolean {
        var c: boolean = false;
        for (var i: number = 0, j: number = points.length - 1; i < points.length; i += 1) {
            var px1: number = points[i].x + startingLocation.x;
            var px2: number = points[j].x + startingLocation.x;
            var py1: number = points[i].y + startingLocation.y;
            var py2: number = points[j].y + startingLocation.y;
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