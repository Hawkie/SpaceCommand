import { Coordinate } from "../Common/Coordinate";
import { MovingGameObject } from "../Common/GameObject";
import { IDisplayObject, Polygon } from "../Common/DisplayObject"


export class Asteroid extends MovingGameObject {

// 5 different asteroid shapes
    //  [-4,-2,-2,-4,0,-2,2,-4,4,-2,3,0,4,2,1,4,-2,4,-4,2,-4,-2],
    // 	[-3,0,-4,-2,-2,-4,0,-3,2,-4,4,-2,2,-1,4,1,2,4,-1,3,-2,4,-4,2,-3,0],
    // 	[-2,0,-4,-1,-1,-4,2,-4,4,-1,4,1,2,4,0,4,0,1,-2,4,-4,1,-2,0],
    // 	[-1,-2,-2,-4,1,-4,4,-2,4,-1,1,0,4,2,2,4,1,3,-2,4,-4,1,-4,-2,-1,-2],
    // 	[-4,-2,-2,-4,2,-4,4,-2,4,2,2,4,-2,4,-4,2,-4,-2]
    asteroid1 : Polygon;
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
        var asteroid1 = new Polygon(a1);
        super(asteroid1, location, velx, vely, angle, spin);
        this.asteroid1 = asteroid1;
    }
    
    hitTest(bullet : Coordinate){
        // for now, we accelerate and spin the asteroid when hit
        if (this.asteroid1.hasPoint(this.location, bullet)) {
            this.velx +=2;
            this.spin +=1;
        }
    }
}