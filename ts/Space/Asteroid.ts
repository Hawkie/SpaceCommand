import { Coordinate } from "../Common/Coordinate";
import { LocatedAngledMovingGO } from "../GameObjects/GameObject";
import { IDrawable, Polygon } from "../DisplayObjects/DisplayObject"


export class Asteroid extends LocatedAngledMovingGO {

// 5 different asteroid shapes
    //  [-4,-2,-2,-4,0,-2,2,-4,4,-2,3,0,4,2,1,4,-2,4,-4,2,-4,-2],
    // 	[-3,0,-4,-2,-2,-4,0,-3,2,-4,4,-2,2,-1,4,1,2,4,-1,3,-2,4,-4,2,-3,0],
    // 	[-2,0,-4,-1,-1,-4,2,-4,4,-1,4,1,2,4,0,4,0,1,-2,4,-4,1,-2,0],
    // 	[-1,-2,-2,-4,1,-4,4,-2,4,-1,1,0,4,2,2,4,1,3,-2,4,-4,1,-4,-2,-1,-2],
    // 	[-4,-2,-2,-4,2,-4,4,-2,4,2,2,4,-2,4,-4,2,-4,-2]
    asteroid1: Polygon;
    rectangle: Polygon;
    constructor(location: Coordinate, velx: number, vely: number, angle: number, spin: number) {
        var a1 = [new Coordinate(-4, -2),
            new Coordinate(-2, -4),
            new Coordinate(0, -2),
            new Coordinate(2, -4),
            new Coordinate(4, -2),
            new Coordinate(3, 0),
            new Coordinate(4, 2),
            new Coordinate(1, 3),
            new Coordinate(-2, 4),
            new Coordinate(-4, 2),
            new Coordinate(-4, -2),
        ];
        var r1 = [new Coordinate(- 2, -20),
            new Coordinate(2, -20),
            new Coordinate(2, 20),
            new Coordinate(-2, 20),
            new Coordinate(-2, -20)];
        var asteroid1 = new Polygon(r1);
        super(asteroid1, location, velx, vely, angle, spin);
        this.asteroid1 = asteroid1;
    }
    
    hitTest(bullet : Coordinate) : boolean {
        // for now, we accelerate and spin the asteroid when hit
        if (this.asteroid1.hasPoint(this.location, bullet)) {
            return true;
        }
        return false;
    }
    
    hit(){
         this.velX +=2;
         this.spin +=1;
    }
}