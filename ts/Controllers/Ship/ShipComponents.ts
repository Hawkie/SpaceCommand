import { Coordinate, Vector } from "ts/Physics/Common";
import { ILocated, ILocatedAngledMoving, ILocatedAngledMovingRotatingForwardAcc } from "ts/Data/PhysicsData";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Mover } from "ts/Actors/Movers";
import { IActor } from "ts/Actors/Actor";
import { PolyRotator } from "ts/Actors/Rotators";
import { IParticleData, ParticleData, ParticleDataVectorConstructor } from "ts/Data/ParticleData";
import { ShapeData, RectangleData } from "ts/Data/ShapeData";
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
import { ParticleGenerator, ParticleRemover } from "ts/Actors/ParticleFieldUpdater";
import { IGameObject, SingleGameObject, ComponentObjects, MultiGameObject } from "ts/GameObjects/GameObject";
import { Field } from "ts/GameObjects/ParticleField";
import { AudioObject } from "ts/Sound/SoundObject";
import { RectangleView, PolyView } from "ts/Views/PolyViews";
import { Transforms } from "ts/Physics/Transforms";
import { Model, ShapedModel } from "ts/Models/DynamicModels";


export class ShipComponents {

    static engine1: Coordinate[] = [new Coordinate(-2, 1),
        new Coordinate(0, -1),
        new Coordinate(2, 1),
        new Coordinate(0, 0),
        new Coordinate(-2, 1)]; 

    static engine2: Coordinate[] = [new Coordinate(-1, -1),
        new Coordinate(-2, 0),
        new Coordinate(2, 0),
        new Coordinate(1, -1),
        new Coordinate(0, 0),
        new Coordinate(-1, -1)]; 

    static createEngine(data: ILocatedAngledMoving): SingleGameObject<ShapedModel<ILocatedAngledMoving, ShapeData>> {
        var engineShape = ShipComponents.engine1;
        //Transforms.scale(engineShape, 2, 2);
        var shapeData = new ShapeData(engineShape, new Coordinate(0, 5));
        var model = new ShapedModel<ILocatedAngledMoving, ShapeData>(data, shapeData);
        var view = new PolyView(data, shapeData);
        var rotator = new PolyRotator(data, shapeData);
        return new SingleGameObject<ShapedModel<ILocatedAngledMoving, ShapeData>>(model, [rotator], [view]);
    }
}
