import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate } from "ts/Physics/Common";
import { ILocated } from "ts/Data/PhysicsData";
import { IShape } from "ts/Data/ShapeData";
import { IParticleFieldData } from "ts/Models/ParticleFieldModel";



export interface IView {
    display(drawContext: DrawContext);
}

export class PolyView implements IView {
    constructor(private properties: ILocated, private shape: IShape) { }

    display(drawContext: DrawContext) {
        drawContext.drawP(this.properties.location, this.shape.points);
    }
}

export class ParticleFieldView implements IView {
    constructor(private properties: IParticleFieldData, private sizeX:number, private sizeY:number) { }

    display(drawContext: DrawContext) {
        this.properties.particles.forEach(point => drawContext.drawRect(point.data.location.x, point.data.location.y, this.sizeX, this.sizeY));
    }
}
