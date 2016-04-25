import { MovingGameObject } from "../Common/GameObject";
import { LandingBasicShip } from "../Ships/LandingShip";
import { Coordinate } from "../Common/Coordinate";
import { Polygon } from "../Common/DisplayObject"

export class LandingPad extends MovingGameObject{
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
        super(polygon, location, 0, 0, 0, 0);
        this.landingPadPolygon = polygon;
    }
    
    hitTest(playerPos : Coordinate) : boolean{
        return this.landingPadPolygon.hasPoint(this.location, playerPos);
    }
    
    hit(player : LandingBasicShip){
        if(player.vely > 0){
            console.log("Land velocity: " + player.vely);
            
            if(player.vely > 20){
                player.crash();
            }
            
            player.vely = 0;
            player.velx = 0;
        }
    }
}