import { Coordinate, Vector, IVector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
// data
// import { IShipData, SpaceShipData, LandingShipData } from "ts/Data/ShipData";
import { ILocated, ILocatedAngledMoving, ILocatedAngledMovingRotatingForces,
    ILocatedMovingAngledRotating, LocatedMovingAngledRotatingData } from "ts/Data/PhysicsData";
// import { IBreakable, BreakableData } from "ts/Data/BreakableData";
import { IShape, ShapeData } from "ts/Data/ShapeData";
// model
import { ShapedModel, GPSModel } from "ts/Models/DynamicModels";
// actors
import { IActor } from "ts/Actors/Actor";
import { PolyRotator } from "ts/Actors/Rotators";
// gameObjects
import { IGameObject, SingleGameObject, ComponentObjects, MultiGameObject } from "ts/GameObjects/GameObject";
import { Field } from "ts/GameObjects/ParticleField";
import { AudioObject } from "ts/Sound/SoundObject";
// views
import { PolyView } from "ts/Views/PolyViews";
import { IView } from "../../Views/View";
import { MoveConstVelocity, IMoveOut } from "../../Actors/Movers";


export class ShipComponents {

    

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

    // static createEngine(data: ILocatedAngledMovingRotatingForces): ShipComponentObject {
    //     var engineShape = ShipComponents.engine1();
    //     var component = new BreakableData(20, 20, 0, false, false);
    //     var shapeData = new ShapeData(engineShape, new Coordinate(0, 5));
    //     var model = new GPSModel<IBreakable, ILocatedAngledMovingRotatingForces, IShape>(component, data, shapeData);
    //     var view: IView = new PolyView(() => { return {
    //         x: data.location.x,
    //         y: data.location.y,
    //         shape: model.shape,
    //     };});
    //     var rotator: IActor = new PolyRotator(() => { return {
    //         angle: data.angle,
    //         shape: model.shape,
    //     };}, (out: IShape)=> {
    //         model.shape = out;
    //     });
    //     return new ShipComponentObject(model, [rotator], [view]);
    // }

    private static gunShape1(): Coordinate[] {
        let gunShape = [new Coordinate(0, -2),
            new Coordinate(0, 0),
            new Coordinate(0, -2)];
        Transforms.scale(gunShape, 2, 2);
        return gunShape;
    }

    // static createGun(data: ILocatedMovingAngledRotating): SingleGameObject<ShapedModel<ILocatedAngledMoving, ShapeData>> {
    //     var gunShape = ShipComponents.gunShape1();
    //     var component = new BreakableData(20, 20, 0, false, false);
    //     var shapeData = new ShapeData(gunShape, new Coordinate(0, -8));
    //     var model = new GPSModel<IBreakable, ILocatedMovingAngledRotating, IShape>(component, data, shapeData);
    //     var view: IView = new PolyView(() => { return {
    //         x: data.location.x,
    //         y: data.location.y,
    //         shape: model.shape,
    //     };});
    //     var rotator: IActor = new PolyRotator(() => { return {
    //         angle: data.angle,
    //         shape: model.shape,
    //     };}, (out: IShape)=> {
    //         model.shape = out;
    //     });
    //     return new SingleGameObject<ShapedModel<ILocatedAngledMoving, ShapeData>>(model, [rotator], [view]);
    // }
}
