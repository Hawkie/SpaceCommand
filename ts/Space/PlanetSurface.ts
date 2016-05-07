import { IGameObject } from "../GameObjects/GameObject";
import { LandingBasicShip } from "../Ships/LandingShip";
import { LandingPad } from "./LandingPad";
import { Coordinate } from "../Physics/Common";
import { Polygon } from "../DisplayObjects/DisplayObject";
import { DrawContext } from "../Common/DrawContext";

export class PlanetSurface implements IGameObject {
    landingPad : LandingPad;
    surfacePolygon : Polygon;
    
    xMin = 20;
    xMax = 40;
    yMin = -20;
    yMax = 20;
    
    constructor(private surfaceStartingPoint: Coordinate) {
        this.landingPad = new LandingPad(new Coordinate(0, 0)); // Temporarily place at (0,0) so this.generateSurface can position it
        this.surfacePolygon = new Polygon(this.generateSurface(600));
    }
    
    generateSurface(surfaceLength : number) : Coordinate[]{
        // Could probably be nicer code but works for now
        
        var points : Coordinate[] = [];
        
        var x = 0, y = 0;
        var sameY = false;
        points.push(new Coordinate(-1,200));
        while(true){
            points.push(new Coordinate(x, y));
            
            if(sameY)
                sameY = false;
            else
                y = this.random(this.yMin, this.yMax);
            x += this.random(this.xMin, this.xMax);
            
            if(x > (surfaceLength / 5) && this.landingPad.location.x == 0){ // Position the landing pad
                this.landingPad.location = new Coordinate(x + 12, (this.surfaceStartingPoint.y + y) - 10);
                sameY = true;
            }
            
            if(x > surfaceLength){
                points.push(new Coordinate(surfaceLength, this.random(this.yMin, this.yMax)));
                break;
            }
        }
        points.push(new Coordinate(512,200));
        
        
        return points;
    }
    
    update(lastTimeModifier : number){
        this.landingPad.update(lastTimeModifier);
    }
    
    display(drawingContext : DrawContext){
        this.surfacePolygon.draw(this.surfaceStartingPoint, drawingContext);
        this.landingPad.display(drawingContext);
    }
    
    hitTest(playerPos : Coordinate) : boolean{
        return this.surfacePolygon.hasPoint(this.surfaceStartingPoint, playerPos);
    }
    
    hit(player : LandingBasicShip){
        player.velY = 0;
        player.velX = 0;
        player.crash();
    }
    
    private random(min : number, max : number){
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}