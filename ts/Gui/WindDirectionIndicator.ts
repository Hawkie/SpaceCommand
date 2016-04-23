import { GuiPolygon } from "./GuiPolygon";
import { Coordinate } from "../Common/Coordinate";
import { Polygon } from "../Common/DisplayObject";

// TODO: Display wind speed text next to arrow

export class WindDirectionIndicator extends GuiPolygon{
    polygonRight : Polygon;
    polygonLeft : Polygon;
    blowingRight : boolean;
    
    constructor(location : Coordinate){
        var pointsRight : Coordinate[] = [new Coordinate(-15, 10),
                                         new Coordinate(15, 10),
                                         new Coordinate(15, 20),
                                         new Coordinate(30, 0),
                                         new Coordinate(15, -20),
                                         new Coordinate(15, -10),
                                         new Coordinate(-15, -10),
                                         new Coordinate(-15, 10)];
        
        var pointsLeft : Coordinate[] = [new Coordinate(20, 10),
                                         new Coordinate(-10, 10),
                                         new Coordinate(-10, 20),
                                         new Coordinate(-25, 0),
                                         new Coordinate(-10, -20),
                                         new Coordinate(-10, -10),
                                         new Coordinate(20, -10),
                                         new Coordinate(20, 10)];
        
        super(new Polygon(pointsRight), location);
        this.polygonRight = new Polygon(pointsRight);
        this.polygonLeft = new Polygon(pointsLeft);
        this.blowingRight = true;
    }
    
    changeWindDirection(){
        this.blowingRight = !this.blowingRight; // invert
        this.updatePolygon();
    }
    
    private updatePolygon(){
        if(this.blowingRight)
            this.displayObject = this.polygonRight;
        else
            this.displayObject = this.polygonLeft;
    }
}