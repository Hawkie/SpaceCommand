import { DrawContext } from "../Common/DrawContext";
import { LocatedGO } from "../GameObjects/GameObject";
import { IDrawable, Polygon } from "../DisplayObjects/DisplayObject";
import { Coordinate } from "../Common/Coordinate";

export class GuiPolygon extends LocatedGO{
    constructor(polygon: Polygon, location: Coordinate) {
        super(polygon, location);
    }
}