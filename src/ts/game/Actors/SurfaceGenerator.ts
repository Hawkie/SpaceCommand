import { Coordinate, ICoordinate } from "ts/gamelib/DataTypes/Coordinate";
import { Transforms } from "ts/gamelib/Physics/Transforms";
import { IActor } from "ts/gamelib/Actors/Actor";

export interface ISurfaceGeneration {
    resolution: number;
    lower: number;
    upper: number;
}

export interface ISurface {
    addedLeft: number;
    points: ICoordinate[];
}

export function generatePoint(x: number, yBase: number, lower: number, upper: number): ICoordinate {
    return new Coordinate(x, yBase + Transforms.random(lower, upper));
}

export function initSurface(width: number, getInputs:() => ISurfaceGeneration): ICoordinate[] {
    let inputs: ISurfaceGeneration = getInputs();
    let endIndex: number = width / inputs.resolution;
    let points: ICoordinate[] = [];
    // changing state
    points[0] = new Coordinate(0, 400);
    for (let i: number = 1; i < endIndex; i++) {
        let point: ICoordinate = generatePoint(i*inputs.resolution, points[i-1].y, inputs.lower, inputs.upper);
        points.push(point);
    }
    let first: Coordinate = points[0];
    let last: Coordinate = points[points.length - 1];

    // draw lines down to create polygon (for collision detection)
    points.unshift(new Coordinate(first.x - 100, 1000));
    points.push(new Coordinate(last.x + 100, 1000));
    return points;
}

export function addSurface(getFrom: ()=>ICoordinate,
    width: number,
    getInputs:() => ISurfaceGeneration,
    getSurface:()=>ISurface): void {
    let from: ICoordinate = getFrom();
    let inputs: ISurfaceGeneration = getInputs();
    let surface: ISurface = getSurface();
    let buffer: number = (width / 2); // 260
    let left: number = from.x - buffer; // 256 - 260 = -4  // 1 - 260 = - 259 // 400 - 260 = 140
    let right: number = from.x + buffer; // 256+260 = 516 // 1 + 260 = 261 // 400 + 260 = 660
    let leftIndex: number = Math.floor(left / inputs.resolution); // 0 // -25 // 14
    let rightIndex: number = Math.ceil(right / inputs.resolution); // 52 // 27 // 66
    let toAddLeft: number = leftIndex + surface.addedLeft; // -0.4 // -26.5
    if (toAddLeft < 0) {
        // remove first element (bottom point)
        surface.points.shift();
        for (let l: number = 0; toAddLeft < l; l--) {
            // toDO change to let
            var first: Coordinate = surface.points[0];
            surface.points.unshift(
                new Coordinate(first.x - inputs.resolution,
                    first.y + Transforms.random(inputs.lower, inputs.upper)));
            surface.addedLeft++;
        }
        // re add the bottom point
        surface.points.unshift(new Coordinate(first.x - 100, 1000));
    }
    let toAddRight: number = rightIndex - (surface.points.length - surface.addedLeft - 3); // 51.6- 52 - 0 = -0.4
    console.log("length " + surface.points.length);
    console.log("rightIndex " + rightIndex);
    console.log("toAdd " + toAddRight);
    console.log("fromx " + from.x);
    if (toAddRight > 0) {
        // remove last point - bottom of surface shape
        surface.points.pop();
        for (let r: number = 0; toAddRight > r; r++) {
            // toDO change to let
            var last: Coordinate = surface.points[surface.points.length - 1];
            surface.points.push(new Coordinate(last.x + inputs.resolution,
                 last.y + Transforms.random(inputs.lower,inputs.upper)));
        }
        // re-add end point at bottom of shape
        surface.points.push(new Coordinate(last.x + 100, 1000));
    }
}


export class SurfaceGenerator2 implements IActor {
    constructor(private getFrom:()=>ICoordinate, private getInputs:()=>ISurfaceGeneration, private getSurface: ()=>ISurface) {
        //
    }
    update(timeModifier: number): void {
        addSurface(this.getFrom, 520, this.getInputs, this.getSurface);
    }
}



// export class SurfaceGenerator implements IActor {

// a    WIDTH: number;
// a    HEIGHT: number;
// a    CHUNK: number;
//     addedLeft: number;

//     constructor(private from: ICoordinate, private shape: IShape, private lower: number = -5, private upper: number = 5) {
//         this.WIDTH = 520;
//         this.HEIGHT = 480;
//         this.CHUNK = 10;
//         this.addedLeft = 0;
//     }

//     initSurface(): void {
//         let endIndex: number = this.WIDTH / this.CHUNK;
//         this.shape.points[0] = new Coordinate(0, 400);
//         for (let i: number = 1; i < endIndex; i++) {
//             this.shape.points.push(new Coordinate(i*this.CHUNK, this.shape.points[i - 1].y + Transforms.random(this.lower, this.upper)));
//         }
//         let first: Coordinate = this.shape.points[0];
//         let last: Coordinate = this.shape.points[this.shape.points.length - 1];

//         // draw lines down to create polygon (for collision detection)
//         this.shape.points.unshift(new Coordinate(first.x - 100, 1000));
//         this.shape.points.push(new Coordinate(last.x + 100, 1000));
//     }

//     addSurface(): void {
//         let buffer: number = (this.WIDTH / 2); // 260
//         let left: number = this.from.x - buffer; // 256 - 260 = -4  // 1 - 260 = - 259 // 400 - 260 = 140
//         let right: number = this.from.x + buffer; // 256+260 = 516 // 1 + 260 = 261 // 400 + 260 = 660
//         let leftIndex: number = Math.floor(left / this.CHUNK); // 0 // -25 // 14
//         let rightIndex: number = Math.ceil(right / this.CHUNK); // 52 // 27 // 66
//         let toAddLeft: number = leftIndex + this.addedLeft; // -0.4 // -26.5
//         if (toAddLeft < 0) {
//             this.shape.points.shift();
//             for (let l: number = 0; toAddLeft < l; l--) {
//                 let first: Coordinate = this.shape.points[0];
//                 this.shape.points.unshift(new Coordinate(first.x - this.CHUNK, first.y + Transforms.random(this.lower, this.upper)));
//                 this.addedLeft++;
//             }
//             this.shape.points.unshift(new Coordinate(first.x - 100, 1000));
//         }
//         let toAddRight: number = rightIndex - (this.shape.points.length - this.addedLeft - 3); // 51.6- 52 - 0 = -0.4
//         console.log("length " + this.shape.points.length);
//         console.log("rightIndex " + rightIndex);
//         console.log("toAdd " + toAddRight);
//         console.log("fromx " + this.from.x);
//         if (toAddRight > 0) {
//             this.shape.points.pop();
//             for (let r: number = 0; toAddRight > r; r++) {
//                 let last: Coordinate = this.shape.points[this.shape.points.length - 1];
//                 this.shape.points.push(new Coordinate(last.x + this.CHUNK, last.y + Transforms.random(this.lower, this.upper)));
//             }

//             this.shape.points.push(new Coordinate(last.x + 100, 1000));
//         }
//     }

//     update(timeModifier: number): void {
//         this.addSurface();
//     }
// }