import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";

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


export class Polygon implements IRotatable {
    private points: Coordinate[];
    constructor(points: Coordinate[]) {
        this.points = points;
    }

    rotate(angle: number) {
        this.points = Transforms.Rotate(this.points, angle);
    }
    
}

export class Rect {
    sizeX: number;
    sizeY: number;
    constructor(sizeX: number, sizeY: number) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }

    //draw(location: Coordinate, drawingContext: DrawContext) {
    //    drawingContext.drawRect(location.x, location.y, this.sizeX, this.sizeY);
    //}
}