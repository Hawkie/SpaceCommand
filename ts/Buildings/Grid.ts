import { StaticGameObject } from "../Common/GameObject";
import { Coordinate } from "../Common/Coordinate";
import { Polygon } from "../DisplayObjects/DisplayObject";

export class Grid extends StaticGameObject{
    oneThirdX : number;
    oneThirdY : number;
    
    constructor(){
        var width = 512, height = 480;
        var w = width / 3, h = height / 3;
        var points : Coordinate[] = [new Coordinate(w, 0),
                                     new Coordinate(w, height),
                                     new Coordinate(w * 2, height),
                                     new Coordinate(w * 2, 0),
                                     new Coordinate(width, 0),
                                     new Coordinate(width, h),
                                     new Coordinate(0, h),
                                     new Coordinate(0, h * 2),
                                     new Coordinate(width, h * 2)];
        
        super(new Polygon(points), new Coordinate(0,0));
        this.oneThirdX = w;
        this.oneThirdY = h;
    }
}