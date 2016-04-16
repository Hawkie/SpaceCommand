import { DrawContext } from "./DrawContext";
import { Coordinate } from "./Coordinate";

export interface IDisplayObject {
    draw(location : Coordinate, drawingContext : DrawContext);
}

export class Polygon implements IDisplayObject
{
    private points : Coordinate[];
    constructor(points : Coordinate[]){
        this.points = points;
    }
    
    // method invoking basic methods on drawcontext
    draw(location : Coordinate, drawingContext : DrawContext) {
        drawingContext.drawP(location, this.points);
    }
    
}