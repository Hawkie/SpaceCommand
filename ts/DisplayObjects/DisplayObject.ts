import { DrawContext } from "../Common/DrawContext";
import { Coordinate } from "../Physics/Common";
import { Transforms } from "../Physics/Transforms";

// Display objects are simple objects that only have the single responsibility to render to the screen.
// This therefore fulfills the S of SOLID design principle.
// Examples are polygon, rectangle, text, sprite.
// This object is contained inside a GameObject, which holds the location and other game state variables. 
export interface IDrawable {
    draw(location: Coordinate, drawingContext: DrawContext);
}

export interface IRotatable{
    rotate(angle: number);
}

export interface IDrawableAndRotatable extends IDrawable, IRotatable { }

export class Polygon implements IDrawable, IRotatable {
    private points: Coordinate[];
    constructor(points: Coordinate[], rotateMethod : number = 0) {
        this.points = points;
    }

    // method invoking basic methods on drawcontext
    draw(location: Coordinate, drawingContext: DrawContext) {
        drawingContext.drawP(location, this.points);
    }

    rotate(angle: number) {
        this.points = Transforms.rotate(this.points, angle);
    }
    
    // https://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    hasPoint(location : Coordinate, testPoint : Coordinate) : boolean
    {
        var c = false;
        for (var i=0, j= this.points.length-1; i< this.points.length;i+=1) {
            var px1 = this.points[i].x + location.x;
            var px2 = this.points[j].x + location.x;
            var py1 = this.points[i].y + location.y;
            var py2 = this.points[j].y + location.y;
            if ((py1 > testPoint.y !== py2 > testPoint.y) &&
                (testPoint.x < (px2 - px1) * (testPoint.y - py1) / (py2 - py1) + px1)
            ) {
                c = !c;
            }
            j = i;
        }
        return c;
    }
}

export class Rect implements IDrawable {
    sizeX: number;
    sizeY: number;
    constructor(sizeX: number, sizeY: number) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }

    draw(location: Coordinate, drawingContext: DrawContext) {
        drawingContext.drawRect(location.x, location.y, this.sizeX, this.sizeY);
    }
}