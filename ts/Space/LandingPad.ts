import { MovingGameObject } from "../Common/GameObject";
import { Coordinate } from "../Common/Coordinate";
import { Polygon } from "../Common/DisplayObject"

export class LandingPad extends MovingGameObject{
    landingPadPolygon : Polygon;
    constructor(location : Coordinate){
        var points = [
            new Coordinate(-20, -5),
            new Coordinate(-20, 0),
            new Coordinate(20, 0),
            new Coordinate(20, -5)
        ];
        var polygon = new Polygon(points);
        super(polygon, location, 0, 0, 0, 0);
        this.landingPadPolygon = polygon;
    }
    
    hitTest(playerPos : Coordinate) : boolean{
        return this.landingPadPolygon.hasPoint(this.location, playerPos);
    }
    
    hit(player : MovingGameObject){
        //console.log("Landed!");
        console.log(player.vely);
        if(player.vely > 0)
            player.vely = 0;
    }
}