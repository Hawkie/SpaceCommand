import { IGameObject } from "../Common/GameObject";
import { Coordinate } from "../Common/Coordinate";
import { DrawContext } from "../Common/DrawContext";

export class GuiText implements IGameObject{
    text : string;
    location : Coordinate;
    font : string;
    fontSize : number;
    
    constructor(text : string, location : Coordinate, font : string, fontSize : number){
        this.text = text;
        this.location = location;
        this.font = font;
        this.fontSize = fontSize;
    }
    
    update(timeModifier : number){}
    
    display(drawingContext : DrawContext){
        drawingContext.drawText(this.location.x, this.location.y, this.text, this.fontSize, this.font);
    }
}