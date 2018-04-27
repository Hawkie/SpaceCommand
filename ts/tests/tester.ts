import { Coordinate } from "ts/gamelib/Data/Coordinate"
import { Transforms } from "../Physics/Transforms";
//import { Polygon } from "../DisplayObjects/DisplayObject";
import { PlanetSurfaceModel } from "ts/States/Land/PlanetSurface";


export class Tester {

    allTests() {
        this.testPlanetSurfaceGenerator();
        this.testVector();
        this.testCollision(false, 5,5);
        this.testCollision(true, 4.9,4.9); // TODO should pass?
        this.testCollision(true, 5,4); // TODO should pass?
        this.testCollision(true, 4,5); // TODO should pass?
        this.testCollision(false, 6,5); // TODO should pass?
        this.testCollision(false, 4,6); // TODO should pass?
        this.testCollision(false, -1,5);
        this.testCollision(false, 5, -1);
        this.testMap();
    }

    testVector() {
        var c: Coordinate = Transforms.VectorToCartesian(45, 100);
        console.log("Vector: " + c.x + "," + c.y)
    }
    
     testCollision(expected : boolean, x : number, y : number) {
        var c: Coordinate = new Coordinate(x,y);
        var p = [new Coordinate(0,10), new Coordinate(10,0), new Coordinate(0,0), new Coordinate(0,10)];
        var t = Transforms.hasPoint(p, new Coordinate(0,0), c);
        console.log("Point(" + c.x + "," + c.y + ") " + t + " " + Tester.pass(expected, t));
    }

     testPlanetSurfaceGenerator() {
         var s = new Coordinate(0, 0); 
         var surface = new PlanetSurfaceModel(s);
         PlanetSurfaceModel.generateSurface(s, 600);
     }

     testMap() {
             let m: { [i: number]: number } = { 2: 2, 4: 5, 5: 7 };
             let v = m[4];
             
             console.log("Map:" + v);
             return v;
     }
    
    static pass(expected : boolean, actual : boolean) : string{
        if (expected == actual) return "pass";
        return "fail";
    }
}