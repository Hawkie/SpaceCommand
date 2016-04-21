import { DrawContext } from "../Common/DrawContext";
import { StaticGameObject } from "../Common/GameObject";
import { IDisplayObject, Polygon } from "../Common/DisplayObject";
import { Coordinate } from "../Common/Coordinate";

export class GuiPolygon extends StaticGameObject{
    constructor(polygon : Polygon, location : Coordinate){
        super(polygon, location);
    }
}