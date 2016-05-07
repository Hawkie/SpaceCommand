import { LocatedGO } from "../GameObjects/GameObject";
import { LandingBasicShip } from "../Ships/LandingShip";
import { Coordinate } from "../Physics/Common";
import { Polygon } from "../DisplayObjects/DisplayObject"

export class LandingPad extends LocatedGO {
    landingPadPolygon : Polygon;
    constructor(location : Coordinate){
        var points = [
            new Coordinate(-10, -2),
            new Coordinate(-13, 10),
            new Coordinate(-10, 0),
            new Coordinate(10, 0),
            new Coordinate(13, 10),
            new Coordinate(10, -2)
        ];
        var polygon = new Polygon(points);
        super(polygon, location);
        this.landingPadPolygon = polygon;
    }
    
    hitTest(playerPos : Coordinate) : boolean{
        return this.landingPadPolygon.hasPoint(this.location, playerPos);
    }
    
    hit(player : LandingBasicShip){
        if(player.velY > 0){
            console.log("Land velocity: " + player.velY);
            
            if(player.velY > 20){
                player.crash();
            }
            
            player.velY = 0;
            player.velX = 0;
        }
    }
}