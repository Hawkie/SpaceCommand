import { LandingPadModel } from "ts/Models/Land/LandingPad";
import { Coordinate } from "ts/Physics/Common";
import { IShapeLocated, IMoving, ShapeLocatedModel } from "ts/Models/PolyModels";

export interface IPlanetSurfaceModel extends IShapeLocated {
    landingPad: IShapeLocated;
}

export class PlanetSurfaceModel extends ShapeLocatedModel implements IPlanetSurfaceModel {
    landingPad : LandingPadModel;
    
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
        this.landingPad = new LandingPadModel(new Coordinate(0, 0)); // Temporarily place at (0,0) so this.generateSurface can position it
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
                y = PlanetSurfaceModel.random(this.yMin, this.yMax);
            x += PlanetSurfaceModel.random(this.xMin, this.xMax);
            
            if(x > (surfaceLength / 5) && this.landingPad.location.x == 0){ // Position the landing pad
                this.landingPad.location = new Coordinate(x + 12, (this.location.y + y) - 10);
                sameY = true;
            }
            
            if(x > surfaceLength){
                points.push(new Coordinate(surfaceLength, PlanetSurfaceModel.random(this.yMin, this.yMax)));
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