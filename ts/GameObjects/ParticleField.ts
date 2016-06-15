
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { IParticleData, IParticleFieldData, ParticleData, ParticleFieldData } from "ts/Models/ParticleFieldModel";
import { DynamicModel } from "ts/Models/DynamicModels";
import { Coordinate, Vector } from "ts/Physics/Common";
import { IGameObject, GameObject } from "ts/GameObjects/GameObject";

export class ParticleField extends GameObject<DynamicModel<IParticleFieldData>> {
    constructor(model: DynamicModel<IParticleFieldData>, sizeX: number = 1, sizeY: number = 1) {
        var view: ParticleFieldView = new ParticleFieldView(model.data, sizeX, sizeY);
        super(model, [view]);
    }
}
