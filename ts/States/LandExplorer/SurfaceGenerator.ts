import { Coordinate, ICoordinate } from "ts/gamelib/Data/Coordinate";
import { Transforms } from "ts/gamelib/Physics/Transforms";
import { IActor } from "ts/gamelib/Actors/Actor";
import { IShape, Shape } from "ts/gamelib/Data/Shape";

export class SurfaceGenerator implements IActor {

    WIDTH: number;
    HEIGHT: number;
    CHUNK: number;
    addedLeft: number;

    constructor(private from: ICoordinate, private shape: IShape, private lower: number = -5, private upper: number = 5) {
        this.WIDTH = 520;
        this.HEIGHT = 480;
        this.CHUNK = 10;
        this.addedLeft = 0;
    }

    initSurface(): void {
        var endIndex: number = this.WIDTH / this.CHUNK;
        this.shape.points[0] = new Coordinate(0, 400);
        for (let i: number = 1; i < endIndex; i++) {
            this.shape.points.push(new Coordinate(i*this.CHUNK, this.shape.points[i - 1].y + Transforms.random(this.lower, this.upper)));
        }
        var first: Coordinate = this.shape.points[0];
        var last: Coordinate = this.shape.points[this.shape.points.length - 1];

        // draw lines down to create polygon (for collision detection)
        this.shape.points.unshift(new Coordinate(first.x - 100, 1000));
        this.shape.points.push(new Coordinate(last.x + 100, 1000));
    }

    addSurface(): void {
        var buffer: number = (this.WIDTH / 2); // 260
        var left: number = this.from.x - buffer; // 256 - 260 = -4  // 1 - 260 = - 259 // 400 - 260 = 140
        var right: number = this.from.x + buffer; // 256+260 = 516 // 1 + 260 = 261 // 400 + 260 = 660
        var leftIndex: number = Math.floor(left / this.CHUNK); // 0 // -25 // 14
        var rightIndex: number = Math.ceil(right / this.CHUNK); // 52 // 27 // 66
        var toAddLeft: number = leftIndex + this.addedLeft; // -0.4 // -26.5
        if (toAddLeft < 0) {
            this.shape.points.shift();
            for (let l: number = 0; toAddLeft < l; l--) {
                var first: Coordinate = this.shape.points[0];
                this.shape.points.unshift(new Coordinate(first.x - this.CHUNK, first.y + Transforms.random(this.lower, this.upper)));
                this.addedLeft++;
            }
            this.shape.points.unshift(new Coordinate(first.x - 100, 1000));
        }
        var toAddRight: number = rightIndex - (this.shape.points.length - this.addedLeft - 3); // 51.6- 52 - 0 = -0.4
        console.log("length " + this.shape.points.length);
        console.log("rightIndex " + rightIndex);
        console.log("toAdd " + toAddRight);
        console.log("fromx " + this.from.x);
        if (toAddRight > 0) {
            this.shape.points.pop();
            for (let r: number = 0; toAddRight > r; r++) {
                var last: Coordinate = this.shape.points[this.shape.points.length - 1];
                this.shape.points.push(new Coordinate(last.x + this.CHUNK, last.y + Transforms.random(this.lower, this.upper)));
            }

            this.shape.points.push(new Coordinate(last.x + 100, 1000));
        }
    }

    update(timeModifier: number): void {
        this.addSurface();
    }
}