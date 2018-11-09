// import { Coordinate, ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
// import { IShape, Shape } from "../../../gamelib/DataTypes/Shape";
// import { IActor } from "../../../gamelib/Actors/Actor";
// import { LandingPadModel } from "ts/States/Land/LandingPad";
// // import { ShapedModel } from "ts/Models/DynamicModels";
// import { Transforms } from "../../../gamelib/Physics/Transforms";
// import { SurfaceGenerator } from "ts/States/LandExplorer/SurfaceGenerator";

// export class PlanetSurfaceModel {

//     constructor(startingPoint: ICoordinate) {
//         let located:ICoordinate = startingPoint;
//         let shape:IShape = new Shape([]);
//     }
    
    
//     static generateSurface(startingPoint: Coordinate, surfaceLength : number, xMin:number = 20, xMax:number = 40, yMin:number = -20, yMax:number = 20) : Coordinate[]{
        
//         let points : Coordinate[] = [];
//         let padLocation : Coordinate = undefined;
        
//         let x = 0, y = 0;
//         let sameY = false;
//         points.push(new Coordinate(-1, 200));
//         while(true){
//             points.push(new Coordinate(x, y));
            
//             if(sameY)
//                 sameY = false;
//             else
//                 y = Transforms.random(yMin, yMax);
//             x += Transforms.random(xMin, xMax);
            
//             // Position the landing pad
//             if (x > (surfaceLength / 5) && padLocation === undefined) { 
//                 padLocation = new Coordinate(x + 12, (startingPoint.y + y) - 10);
//                 sameY = true;
//             }
            
//             if(x > surfaceLength){
//                 points.push(new Coordinate(surfaceLength, Transforms.random(yMin, yMax)));
//                 break;
//             }
//         }
//         points.push(new Coordinate(surfaceLength,200));
//         points.push(padLocation);
//         return points;
//     }
// }