import { StaticGameObject, MovingGameObject } from "../Common/GameObject";
import { LandingPad } from "./LandingPad";
import { Coordinate } from "../Common/Coordinate";
import { Polygon } from "../Common/DisplayObject";
import { DrawContext } from "../Common/DrawContext";

export class PlanetSurface extends StaticGameObject{
    landingPad : LandingPad;
    surfacePolygon : Polygon;
    
    xMin = 20;
    xMax = 40;
    yMin = -20;
    yMax = 20;
    
    constructor(location : Coordinate){
        super(null, location);
        this.landingPad = new LandingPad(new Coordinate(0,0)); // Temporarily place at (0,0) so this.generateSurface can position it
        this.surfacePolygon = new Polygon(this.generateSurface(600));
        this.displayObject = this.surfacePolygon;
    }
    
    generateSurface(surfaceLength : number) : Coordinate[]{
        var points : Coordinate[] = [];
        
        var x = 0, y = 0;
        
        while(true){
            points.push(new Coordinate(x, y));
            
            y = this.random(this.yMin, this.yMax);
            x += this.random(this.xMin, this.xMax);
            
            if(x > (surfaceLength / 5) && this.landingPad.location.x == 0){ // Position the landing pad
                this.landingPad.location = new Coordinate(x - 5, (this.location.y + y) - 10);
            }
            
            if(x > surfaceLength){
                points.push(new Coordinate(surfaceLength, this.random(this.yMin, this.yMax)));
                break;
            }
        }
        
        return points;
    }
    
    update(lastTimeModifier : number){
        super.update(lastTimeModifier);
        this.landingPad.update(lastTimeModifier);
    }
    
    display(drawingContext : DrawContext){
        super.display(drawingContext);
        this.landingPad.display(drawingContext);
    }
    
    hitTest(playerPos : Coordinate) : boolean{
        return this.surfacePolygon.hasPoint(this.location, playerPos);
    }
    
    hit(player : MovingGameObject){
        player.vely = 0;
        player.velx = 0;
        console.log("Ship crashed!");
    }
    
    private random(min : number, max : number){
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}