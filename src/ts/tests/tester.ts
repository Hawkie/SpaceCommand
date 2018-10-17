import { Coordinate, ICoordinate } from "ts/gamelib/DataTypes/Coordinate";
import { Transforms } from "../gamelib/Physics/Transforms";


export class Tester {

    allTests(): void {
        this.testVector();
        this.testCollision(false, 5,5);
        this.testCollision(true, 4.9,4.9); // tODO should pass?
        this.testCollision(true, 5,4); // tODO should pass?
        this.testCollision(true, 4,5); // tODO should pass?
        this.testCollision(false, 6,5); // tODO should pass?
        this.testCollision(false, 4,6); // tODO should pass?
        this.testCollision(false, -1,5);
        this.testCollision(false, 5, -1);
        this.testMap();
    }

    testVector(): void {
        var c: Coordinate = Transforms.VectorToCartesian(45, 100);
        console.log("Vector: " + c.x + "," + c.y);
    }

     testCollision(expected : boolean, x : number, y : number): void {
        var c: Coordinate = new Coordinate(x,y);
        var p: ICoordinate[] = [new Coordinate(0,10), new Coordinate(10,0), new Coordinate(0,0), new Coordinate(0,10)];
        var t: boolean = Transforms.hasPoint(p, new Coordinate(0,0), c);
        console.log("Point(" + c.x + "," + c.y + ") " + t + " " + Tester.pass(expected, t));
    }

     testMap(): number {
             let m: { [i: number]: number } = { 2: 2, 4: 5, 5: 7 };
             let v: number = m[4];
             console.log("Map:" + v);
             return v;
     }

    static pass(expected : boolean, actual : boolean): string {
        if (expected === actual) {
            return "pass";
        }
        return "fail";
    }
}