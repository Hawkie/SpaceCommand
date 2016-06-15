
import { IView } from "ts/Views/View";
import { ParticleFieldView } from "ts/Views/ParticleFieldView";
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { IParticleFieldData, ParticleFieldData } from "ts/Data/ParticleFieldData";
import { DynamicModel } from "ts/Models/DynamicModels";
import { Coordinate, Vector } from "ts/Physics/Common";
import { IGameObject, GameObject } from "ts/GameObjects/GameObject";

export class ParticleField extends GameObject<DynamicModel<IParticleFieldData>> {
    constructor(model: DynamicModel<IParticleFieldData>, sizeX: number = 1, sizeY: number = 1) {
        var view: ParticleFieldView = new ParticleFieldView(model.data, sizeX, sizeY);
        super(model, [view]);
    }
}
