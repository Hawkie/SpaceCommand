import { LandingPadData } from "ts/Models/Land/LandingPad";
import { Coordinate } from "ts/Physics/Common";
import { IShapeLocated, IMoving, ShapeLocatedData } from "ts/Models/PolyModels";
import { IModel } from "ts/Models/DynamicModels";

export interface IPlanetSurfaceData extends IShapeLocated {
    landingPad: IShapeLocated;
}

export class PlanetSurfaceData extends ShapeLocatedData implements IPlanetSurfaceData {
    landingPad : LandingPadData;
    
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    
    constructor(surfaceStartingPoint: Coordinate) {
        super([], surfaceStartingPoint);
        this.xMin = 20;
        this.xMax = 40;
        this.yMin = -20;
        this.yMax = 20;
        this.landingPad = new LandingPadData(new Coordinate(0, 0)); // Temporarily place at (0,0) so this.generateSurface can position it
        this.points = this.generateSurface(600);
    }
    
    generateSurface(surfaceLength : number) : Coordinate[]{
        // Could probably be nicer code but works for now
        
        var points : Coordinate[] = [];
        
        var x = 0, y = 0;
        var sameY = false;
        points.push(new Coordinate(-1, 200));
        while(true){
            points.push(new Coordinate(x, y));
            
            if(sameY)
                sameY = false;
            else
                y = PlanetSurfaceData.random(this.yMin, this.yMax);
            x += PlanetSurfaceData.random(this.xMin, this.xMax);
            
            if(x > (surfaceLength / 5) && this.landingPad.location.x == 0){ // Position the landing pad
                this.landingPad.location = new Coordinate(x + 12, (this.location.y + y) - 10);
                sameY = true;
            }
            
            if(x > surfaceLength){
                points.push(new Coordinate(surfaceLength, PlanetSurfaceData.random(this.yMin, this.yMax)));
                break;
            }
        }
        points.push(new Coordinate(512,200));
        return points;
    }
  
    
    static random(min : number, max : number){
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}