import { Coordinate, ICoordinate } from "../DataTypes/Coordinate";
import { Vector, IVector } from "../DataTypes/Vector";

export class Transforms {

    // generates a random number between min and max
    static random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // conerts a simple array of repeating xy values to Icoordinates[]
    static ArrayToPoints(array: number[]): Coordinate[] {
        let points: Coordinate[] = [];
        for (let i: number = 0; i < array.length - 1; i+=2) {
            points.push(new Coordinate(array[i], array[i + 1]));
        }
        return points;
    }

    // rotate the set of coordiantes about the origin.
    static Rotate(points: Coordinate[], degrees: number): ICoordinate[] {
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

    // for angles of 0 we think go up screen = negative y values
    // for angles of 180 we think going down the screen = positive y values
    // for angle of 90 we think right on screen = positive x values
    // for angle of 270 we think left on screen = negative x values
    static VectorToCartesian(degrees: number, length: number): ICoordinate {
        var radians: number = degrees / 180 * Math.PI;
        var x: number = Math.sin(radians) * length; // sin 0 = 0
        var y: number = Math.cos(radians) * -length; // cos 0 = 1
        return new Coordinate(x, y);
    }

    // takes x and y lengths and returns angle and length vector.
    // converts the angle to degrees (e.g. *180/PI)
    // angle are zero for vertical and increase clockwise (not anticlockwise as is common in maths)
    // http://math.stackexchange.com/questions/1201337/finding-the-angle-between-two-points
    static CartesianToVector(x: number, y: number): IVector {
        var length: number = Math.sqrt(x * x + y * y);
        var angle: number = Math.atan2(x, y) * 180 / Math.PI;
        return new Vector(angle, length);
    }

    // scales a coordinate x and y from origin to new position.
    // warning mutable operation to be changed to non mutable!
    static Scale(points: ICoordinate[], scaleX: number, scaleY:number): ICoordinate[] {
        var newCoordinates:ICoordinate[] = [];
        // iterate thru each vertex and change position
        points.forEach(p => {
            var newCoordinate: ICoordinate = new Coordinate(p.x *= scaleX, p.y *= scaleY);
            newCoordinates.push(newCoordinate);
        });
        return newCoordinates;
    }

    // accurate collision detection algorithm
    // use shape with a starting position
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