
import { IShapeLocated, IShapeLocatedMoving, IShapeLocatedAngledMovingRotataing, IShapeLocatedAngledMovingRotataingAccelerating } from "ts/Models/PolyModels";
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { IParticleData, IParticleFieldData, ParticleData, ParticleFieldData } from "ts/Models/ParticleFieldModel";
import { IModel, DynamicModel } from "ts/Models/DynamicModels";
import { Coordinate, Vector } from "ts/Physics/Common";
import { IGameObject, GameObject } from "ts/GameObjects/GameObject";

export class ParticleField extends GameObject<IModel<IParticleFieldData>> {
    constructor(model: IModel<IParticleFieldData>, sizeX: number = 1, sizeY: number = 1) {
        var view: ParticleFieldView = new ParticleFieldView(model.data, sizeX, sizeY);
        super(model, [view]);
    }
}
