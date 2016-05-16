
import { IShapeLocated, IShapeLocatedMoving, IShapeLocatedAngledMovingRotataing, IShapeLocatedAngledMovingRotataingAccelerating } from "ts/Models/PolyModels";
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { IParticleData, IParticleFieldData, ParticleData, ParticleFieldData } from "ts/Models/ParticleFieldModel";
import { IModel, DynamicModel } from "ts/Models/DynamicModels";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { ParticleGenerator, ParticleFieldMover } from "ts/Actors/ParticleFieldUpdater";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator, Spinner } from "ts/Actors/Rotators";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";
import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { TextObject } from "ts/GameObjects/Common/BaseObjects";


export class ParticleField extends GameObject<IModel<IParticleFieldData>> {
    constructor(model: IModel<IParticleFieldData>, sizeX: number = 1, sizeY: number = 1) {
        var view: ParticleFieldView = new ParticleFieldView(model.data, sizeX, sizeY);
        super(model, [view]);
    }
}
