import { Coordinate } from "../Common/Coordinate"
import { Transforms } from "../Common/Transforms";

export class Tester {

    allTests(){
        this.testVector();
    }

    testVector() {
        var c: Coordinate = Transforms.toVector(45, 100);
        console.log("Vector: " + c.x + "," + c.y)
    }
}