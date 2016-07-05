import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate } from "ts/Physics/Common";
import { ILocated } from "ts/Data/PhysicsData";
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { IParticleFieldData, ParticleFieldData } from "ts/Data/ParticleFieldData";
import { IView } from "ts/Views/View";

export class ParticleFieldViews implements IView {
    constructor(public views: IView[]) {
    }

    display(drawContext: DrawContext) {
        this.views.forEach(view => view.display(drawContext));
    }
}

export class ParticleFieldView implements IView {

    constructor(private properties: IParticleFieldData, private sizeX: number, private sizeY: number) { }

    display(drawContext: DrawContext) {
        this.properties.particles.forEach(point => drawContext.drawRect(point.data.location.x, point.data.location.y, this.sizeX, this.sizeY));
    }
}

