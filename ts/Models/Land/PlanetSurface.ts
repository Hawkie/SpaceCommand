import { Coordinate } from "ts/Physics/Common";
import { ILocated, LocatedData } from "ts/Data/PhysicsData";
import { IShape, ShapeData } from "ts/Data/ShapeData";
import { LandingPadModel } from "ts/Models/Land/LandingPad";
import { ShapedModel } from "ts/Models/DynamicModels";
import { Transforms } from "ts/Physics/Transforms";


export class PlanetSurfaceModel extends ShapedModel<ILocated> {
    landingPad: LandingPadModel;
    
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    
    constructor(startingPoint: Coordinate) {
        var located = new LocatedData(startingPoint);
        this.landingPad = undefined;
        this.xMin = 20;
        this.xMax = 40;
        this.yMin = -20;
        this.yMax = 20;
        
        var shape = new ShapeData(this.generateSurface(startingPoint, 600));
        super(located, shape, []);
    }
    
    generateSurface(startingPoint: Coordinate, surfaceLength : number) : Coordinate[]{
        
        var points : Coordinate[] = [];
        
        var x = 0, y = 0;
        var sameY = false;
        points.push(new Coordinate(-1, 200));
        while(true){
            points.push(new Coordinate(x, y));
            
            if(sameY)
                sameY = false;
            else
                y = Transforms.random(this.yMin, this.yMax);
            x += Transforms.random(this.xMin, this.xMax);
            
            if (x > (surfaceLength / 5) && this.landingPad === undefined) { // Position the landing pad
                var xy = new Coordinate(x + 12, (startingPoint.y + y) - 10);
                this.landingPad = new LandingPadModel(xy);
                sameY = true;
            }
            
            if(x > surfaceLength){
                points.push(new Coordinate(surfaceLength, Transforms.random(this.yMin, this.yMax)));
                break;
            }
        }
        points.push(new Coordinate(512,200));
        return points;
    }
}