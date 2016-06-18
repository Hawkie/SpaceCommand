import { Coordinate } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { IActor } from "ts/Actors/Actor";
import { IShape, ShapeData } from "ts/Data/ShapeData";
import { ILocated } from "ts/Data/PhysicsData";

export class SurfaceGenerator implements IActor {
    
    WIDTH: number;
    HEIGHT: number;
    CHUNK: number;
    addedLeft: number;

    constructor(private from: ILocated, private shape: IShape, private lower: number = -5, private upper: number = 5) {
        this.WIDTH = 520;
        this.HEIGHT = 480;
        this.CHUNK = 10;
        this.addedLeft = 0;
    }

    initSurface() {
        var endIndex = this.WIDTH / this.CHUNK;
        this.shape.points[0] = new Coordinate(0, 400);
        for (let i = 1; i < endIndex; i++) {
            this.shape.points.push(new Coordinate(i*this.CHUNK, this.shape.points[i - 1].y + Transforms.random(this.lower, this.upper)));
        }
        var first = this.shape.points[0];
        var last = this.shape.points[this.shape.points.length - 1];
        this.shape.points.unshift(new Coordinate(first.x - 100, 1000));
        this.shape.points.push(new Coordinate(last.x + 100, 1000));
    }

    addSurface() {
        var buffer = (this.WIDTH / 2); // 260
        var left = this.from.location.x - buffer; //256 - 260 = -4  // -5 - 260 = - 265 // 400 - 260 = 140
        var right = this.from.location.x + buffer; // 256+260 = 516 // -5 + 260 = 255
        var leftIndex = Math.floor(left / this.CHUNK); // -0.4 // -26.5 // 14
        var rightIndex = Math.ceil(right / this.CHUNK); // 51.6 // 25.5
        var toAddLeft = leftIndex + this.addedLeft; //-0.4 // -26.5
        if (toAddLeft < 0) {
            this.shape.points.shift();
            for (let l = 0; toAddLeft < l; l--) {
                var first = this.shape.points[0];
                this.shape.points.unshift(new Coordinate(first.x - this.CHUNK, first.y + Transforms.random(this.lower, this.upper)));
                this.addedLeft++;
            }
            this.shape.points.unshift(new Coordinate(first.x - 100, 1000));
        }
        var toAddRight = rightIndex - this.shape.points.length - this.addedLeft // 51.6- 52 - 0 = -0.4 // 
        if (toAddRight > 0) {
            this.shape.points.pop();
            for (let r = 0; toAddRight > r; r++) {
                var last = this.shape.points[this.shape.points.length - 1];
                this.shape.points.push(new Coordinate(last.x + this.CHUNK, last.y + Transforms.random(this.lower, this.upper)));
            }
            
            this.shape.points.push(new Coordinate(last.x + 100, 1000));
        }
    }

    update(timeModifier: number) {
        this.addSurface();
    }
}