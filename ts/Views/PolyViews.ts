﻿import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate } from "ts/Physics/Common";
import { ILocated, ILocatedAngled } from "ts/Data/PhysicsData";
import { IShape } from "ts/Data/ShapeData";
import { IView } from "ts/Views/View";
import { IGraphic } from "ts/Data/GraphicData";


export class PolyView implements IView {
    constructor(private properties: ILocated, private shape: IShape) { }

    display(drawContext: DrawContext) {
        drawContext.drawP(this.properties.location, this.shape.points);
        drawContext.fill();
    }
}

export class PolyGraphic implements IView {
    constructor(private properties: ILocated, private shape: IShape, private graphic: IGraphic) { }

    display(drawContext: DrawContext) {
        if (this.graphic.loaded) {
            drawContext.drawP(this.properties.location, this.shape.points);
            let fillStyle: CanvasPattern = drawContext.createPattern(this.graphic.img);
            drawContext.fill(fillStyle);
        }
    }
}

export class PolyGraphicAngled implements IView {
    constructor(private properties: ILocatedAngled, private shape: IShape, private graphic: IGraphic) { }

    display(drawContext: DrawContext) {
        if (this.graphic.loaded) {
            drawContext.drawP(this.properties.location, this.shape.points);
            drawContext.save();
            drawContext.translate(this.properties.location.x, this.properties.location.y);
            drawContext.rotate(this.properties.angle);
            let fillStyle: CanvasPattern = drawContext.createPattern(this.graphic.img);
            drawContext.fill(fillStyle);
            drawContext.restore();
        }
    }
}

