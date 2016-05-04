import { Coordinate } from "../Common/Coordinate"
import { Transforms } from "../Common/Transforms";
import { Polygon } from "../DisplayObjects/DisplayObject";

export class Tester {

    allTests(){
        this.testVector();
        this.testCollision(false, 5,5);
        this.testCollision(true, 4.9,4.9); // TODO should pass?
        this.testCollision(true, 5,4); // TODO should pass?
        this.testCollision(true, 4,5); // TODO should pass?
        this.testCollision(false, 6,5); // TODO should pass?
        this.testCollision(false, 4,6); // TODO should pass?
        this.testCollision(false, -1,5);
        this.testCollision(false, 5,-1);
    }

    testVector() {
        var c: Coordinate = Transforms.VectorToCartesian(45, 100);
        console.log("Vector: " + c.x + "," + c.y)
    }
    
     testCollision(expected : boolean, x : number, y : number) {
        var c: Coordinate = new Coordinate(x,y);
        var p = new Polygon([new Coordinate(0,10), new Coordinate(10,0), new Coordinate(0,0), new Coordinate(0,10)]);
        var t = p.hasPoint(new Coordinate(0,0), c);
        console.log("Point(" + c.x + "," + c.y + ") " + t + " " + Tester.pass(expected, t));
    }
    
    static pass(expected : boolean, actual : boolean) : string{
        if (expected == actual) return "pass";
        return "fail";
    }
}