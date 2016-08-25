import { Coordinate, Vector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
// Data
import { ILocated, ILocatedAngledMoving, ILocatedAngledMovingRotatingForwardAcc, LocatedMovingAngledRotatingData } from "ts/Data/PhysicsData";
import { IBreakable, BreakableData } from "ts/Data/BreakableData";
import { IParticleData, ParticleData, ParticleDataVectorConstructor } from "ts/Data/ParticleData";
import { ShapeData, RectangleData } from "ts/Data/ShapeData";
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
// Model
import { Model, ShapedModel, GPSModel } from "ts/Models/DynamicModels";
//Actors
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Mover } from "ts/Actors/Movers";
import { IActor } from "ts/Actors/Actor";
import { PolyRotator } from "ts/Actors/Rotators";
import { ParticleGenerator, ParticleRemover } from "ts/Actors/ParticleFieldUpdater";
// GameObjects
import { IGameObject, SingleGameObject, ComponentObjects, MultiGameObject } from "ts/GameObjects/GameObject";
import { Field } from "ts/GameObjects/ParticleField";
import { AudioObject } from "ts/Sound/SoundObject";
//Views
import { RectangleView, PolyView } from "ts/Views/PolyViews";

export class ShipComponentObject extends SingleGameObject<GPSModel<BreakableData, LocatedMovingAngledRotatingData, ShapeData>>{ }

export class ShipComponents {

    private static engine1: Coordinate[] = [new Coordinate(-2, 1),
        new Coordinate(0, -1),
        new Coordinate(2, 1),
        new Coordinate(0, 0),
        new Coordinate(-2, 1)]; 

    private static engine2: Coordinate[] = [new Coordinate(-1, -1),
        new Coordinate(-2, 0),
        new Coordinate(2, 0),
        new Coordinate(1, -1),
        new Coordinate(0, 0),
        new Coordinate(-1, -1)]; 

    static createEngine(data: ILocatedAngledMoving): SingleGameObject<GPSModel<IBreakable, ILocatedAngledMoving, ShapeData>> {
        var engineShape = ShipComponents.engine1;
        //Transforms.scale(engineShape, 2, 2);
        var component = new BreakableData(20, 20, 0, false, false);
        var shapeData = new ShapeData(engineShape, new Coordinate(0, 5));
        var model = new GPSModel<IBreakable, ILocatedAngledMoving, ShapeData>(component, data, shapeData);
        var view = new PolyView(data, shapeData);
        var rotator = new PolyRotator(data, shapeData);
        return new SingleGameObject<GPSModel<IBreakable, ILocatedAngledMoving, ShapeData>>(model, [rotator], [view]);
    }

    private static gunShape1: Coordinate[] = [new Coordinate(0, -2),
        new Coordinate(0, 0),
        new Coordinate(0, -2)]; 

    static createGun(data: ILocatedAngledMoving): SingleGameObject<ShapedModel<ILocatedAngledMoving, ShapeData>> {
        var gunShape = ShipComponents.gunShape1;
        //Transforms.scale(engineShape, 2, 2);
        var shapeData = new ShapeData(gunShape, new Coordinate(0, -8));
        var model = new ShapedModel<ILocatedAngledMoving, ShapeData>(data, shapeData);
        var view = new PolyView(data, shapeData);
        var rotator = new PolyRotator(data, shapeData);
        return new SingleGameObject<ShapedModel<ILocatedAngledMoving, ShapeData>>(model, [rotator], [view]);
    }
}
