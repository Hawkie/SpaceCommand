import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate } from "ts/Physics/Common";
import { ILocated } from "ts/Data/PhysicsData";
import { IShape } from "ts/Data/ShapeData";
import { IView } from "ts/Views/View";


export class PolyView implements IView {
    constructor(private properties: ILocated, private shape: IShape) { }

    display(drawContext: DrawContext) {
        drawContext.drawP(this.properties.location, this.shape.points);
    }
}

