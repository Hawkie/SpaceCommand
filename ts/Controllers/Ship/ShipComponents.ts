import { Coordinate, Vector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
// Data
import { IShipData, SpaceShipData, LandingShipData } from "ts/Data/ShipData";
import { ILocated, ILocatedAngledMoving, ILocatedAngledMovingRotatingForwardAcc, ILocatedMovingAngledRotating, LocatedMovingAngledRotatingData } from "ts/Data/PhysicsData";
import { IBreakable, BreakableData } from "ts/Data/BreakableData";
import { IParticleData, ParticleData, ParticleDataVectorConstructor } from "ts/Data/ParticleData";
import { IShape, ShapeData, RectangleData } from "ts/Data/ShapeData";
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

export class ShipComponentObject extends SingleGameObject<GPSModel<IBreakable, ILocatedMovingAngledRotating, IShape>>{ }

export class ShipComponents {

    static createShipObj<TShip extends IShipData>(physics: TShip): SingleGameObject<ShapedModel<TShip, ShapeData>> {
        var triangleShip = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];
        Transforms.scale(triangleShip, 2, 2);

        var shape = new ShapeData(triangleShip);
        var ship = new ShapedModel<TShip, ShapeData>(physics, shape);

        var mover: IActor = new Mover(ship.physics);
        var thrust = new ForwardAccelerator(ship.physics);
        var rotator = new PolyRotator(ship.physics, ship.shape);

        var actors: IActor[] = [mover, thrust, rotator];
        var shipView = new PolyView(ship.physics, ship.shape);

        var shipObj = new SingleGameObject<ShapedModel<TShip, ShapeData>>(ship, actors, [shipView]);
        return shipObj;
    }


    private static engine1(): Coordinate[] {
        let engineShape = [new Coordinate(-2, 1),
            new Coordinate(0, -1),
            new Coordinate(2, 1),
            new Coordinate(0, 0),
            new Coordinate(-2, 1)];
        Transforms.scale(engineShape, 2, 2);
        return engineShape;
    }

    private static engine2(): Coordinate[] {
        let engineShape = [new Coordinate(-1, -1),
            new Coordinate(-2, 0),
            new Coordinate(2, 0),
            new Coordinate(1, -1),
            new Coordinate(0, 0),
            new Coordinate(-1, -1)];
        Transforms.scale(engineShape, 2, 2);
        return engineShape;
    }

    static createEngine(data: ILocatedMovingAngledRotating): ShipComponentObject {
        var engineShape = ShipComponents.engine1();
        var component = new BreakableData(20, 20, 0, false, false);
        var shapeData = new ShapeData(engineShape, new Coordinate(0, 5));
        var model = new GPSModel<IBreakable, ILocatedMovingAngledRotating, IShape>(component, data, shapeData);
        var view = new PolyView(data, shapeData);
        var rotator = new PolyRotator(data, shapeData);
        return new ShipComponentObject(model, [rotator], [view]);
    }

    private static gunShape1(): Coordinate[] {
        let gunShape = [new Coordinate(0, -2),
            new Coordinate(0, 0),
            new Coordinate(0, -2)];
        Transforms.scale(gunShape, 2, 2);
        return gunShape;
    }

    static createGun(data: ILocatedMovingAngledRotating): SingleGameObject<ShapedModel<ILocatedAngledMoving, ShapeData>> {
        var gunShape = ShipComponents.gunShape1();
        var component = new BreakableData(20, 20, 0, false, false);
        var shapeData = new ShapeData(gunShape, new Coordinate(0, -8));
        var model = new GPSModel<IBreakable, ILocatedMovingAngledRotating, IShape>(component, data, shapeData);
        var view = new PolyView(data, shapeData);
        var rotator = new PolyRotator(data, shapeData);
        return new SingleGameObject<ShapedModel<ILocatedAngledMoving, ShapeData>>(model, [rotator], [view]);
    }
}
