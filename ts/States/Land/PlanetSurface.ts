import { Coordinate } from "ts/Physics/Common";
import { ILocated, LocatedData } from "ts/Data/PhysicsData";
import { IShape, ShapeData } from "ts/Data/ShapeData";
import { LandingPadModel } from "ts/States/Land/LandingPad";
import { ShapedModel } from "ts/Models/DynamicModels";
import { Transforms } from "ts/Physics/Transforms";


export class PlanetSurfaceModel extends ShapedModel<ILocated> {
    // internal model
    landingPad: LandingPadModel;
    
    
    constructor(startingPoint: Coordinate) {
        var located = new LocatedData(startingPoint);
        var surfacePoints = PlanetSurfaceModel.generateSurface(startingPoint, 600);
        var padLocation = surfacePoints.pop();
        var shape = new ShapeData(surfacePoints);
        var pad = new LandingPadModel(padLocation);
        super(located, shape, [pad]);
        this.landingPad = pad;
    }
    
    static generateSurface(startingPoint: Coordinate, surfaceLength : number, xMin:number = 20, xMax:number = 40, yMin:number = -20, yMax:number = 20) : Coordinate[]{
        
        var points : Coordinate[] = [];
        var padLocation : Coordinate = undefined;
        
        var x = 0, y = 0;
        var sameY = false;
        points.push(new Coordinate(-1, 200));
        while(true){
            points.push(new Coordinate(x, y));
            
            if(sameY)
                sameY = false;
            else
                y = Transforms.random(yMin, yMax);
            x += Transforms.random(xMin, xMax);
            
            // Position the landing pad
            if (x > (surfaceLength / 5) && padLocation === undefined) { 
                padLocation = new Coordinate(x + 12, (startingPoint.y + y) - 10);
                sameY = true;
            }
            
            if(x > surfaceLength){
                points.push(new Coordinate(surfaceLength, Transforms.random(yMin, yMax)));
                break;
            }
        }
        points.push(new Coordinate(surfaceLength,200));
        points.push(padLocation);
        return points;
    }
}