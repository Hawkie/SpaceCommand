import { IGameObject } from "../Common/GameObject";
import { Coordinate } from "../Common/Coordinate";

export class DotField implements IGameObject {
    fieldObjects : Coordinate[];
    startx : number;
    starty : number;
    velx : number;
    vely : number;
    sizex : number;
    sizey : number;
    constructor(startx : number , starty : number, velx : number, vely : number, sizex : number, sizey : number) {
        this.fieldObjects = [];
        this.startx = startx;
        this.starty = starty;
        this.velx = velx;
        this.vely = vely;
        this.sizex = sizex;
        this.sizey = sizey;

    }

    update(lastDrawModifier : number) {
        /// TODO: use distribution pattern for start instead of absolute x,y (canvas size
        var o = new Coordinate(Math.random() * 512, this.starty );
        this.fieldObjects.push(o);
        // move objects
        this.fieldObjects.forEach(function(element) {
            element.x -= this.velx * lastDrawModifier;
            element.y -= this.vely * lastDrawModifier;
        }, this);

    }

    display(drawingContext) {
        //drawingContext.rotateat(0,0, 1 * this.fieldObjects.length);
        this.fieldObjects.forEach(function(element) {
            drawingContext.drawRect(element.x, element.y, this.sizex, this.sizey);
        }, this);
        //drawingContext.rotateat(0,0,-1 * this.fieldObjects.length);
    }
}