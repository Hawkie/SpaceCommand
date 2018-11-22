import { Coordinate, ICoordinate } from "../../gamelib/DataTypes/Coordinate";
import { Transforms } from "../../gamelib/Physics/Transforms";
import { DrawContext } from "../../gamelib/1Common/DrawContext";
import { DrawPolyGraphic } from "../../gamelib/Views/PolyGraphic";
import { Game } from "../Game/Game";
import { IShape } from "../../gamelib/DataTypes/Shape";

export interface ISurfaceGeneration {
    resolution: number;
    lower: number;
    upper: number;
}

export interface ISurface {
    addedLeft: number;
    points: ICoordinate[];
    surfaceGenerator: ISurfaceGeneration;
}

export function DisplaySurface(ctx: DrawContext, surface: ISurface): void {
    //     let surface: ISurface = getSurface();
//     let surfaceExtender: IActor = new SurfaceGenerator2(getFrom, getSurfaceGenerator, getSurface);
    const shape: IShape = { offset: { x: 0, y: 0 }, points: surface.points};
    DrawPolyGraphic(ctx, 0, 0, shape, Game.assets.terrain);
//         return {
//             x: 0,
//             y: 0,
//             shape: {
//                 offset: { x: 0, y: 0 },
//                 points: surface.points,
//             },
//             graphic: texture,
//         };
//     });
//     let obj: SingleGameObject = new SingleGameObject([surfaceExtender], [surfaceView]);
//     return obj;
// }
}

export function generatePoint(x: number, yBase: number, lower: number, upper: number): ICoordinate {
    return new Coordinate(x, yBase + Transforms.random(lower, upper));
}

export function initSurface(width: number, generator: ISurfaceGeneration): ICoordinate[] {
    let endIndex: number = width / generator.resolution;
    let points: ICoordinate[] = [];
    // changing state
    points[0] = new Coordinate(0, 400);
    for (let i: number = 1; i < endIndex; i++) {
        let point: ICoordinate = generatePoint(i*generator.resolution, points[i-1].y, generator.lower, generator.upper);
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

