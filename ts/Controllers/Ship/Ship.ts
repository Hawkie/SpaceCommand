import { Transforms } from "ts/Physics/Transforms";
import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate, Vector } from "ts/Physics/Common";
// Data
import { IShipData, SpaceShipData, LandingShipData } from "ts/Data/ShipData";
import { ShapeData } from "ts/Data/ShapeData";
import { Model, ShapedModel } from "ts/Models/DynamicModels";
// Views
import { IView } from "ts/Views/View";
import { PolyView } from "ts/Views/PolyViews";
// Updaters
import { IActor } from "ts/Actors/Actor";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Mover } from "ts/Actors/Movers";
import { PolyRotator } from "ts/Actors/Rotators";
// Particle Fields
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
import { Field } from "ts/GameObjects/ParticleField";
import { ParticleGenerator, ParticleRemover } from "ts/Actors/ParticleFieldUpdater";
import { IGameObject, SingleGameObject, MultiGameObject } from "ts/GameObjects/GameObject";
// Controllers
import { IShipController, ICrashController, IPrimaryWeaponController, SpaceShipController, LandShipController } from "ts/Controllers/Ship/ShipController";
import { BulletWeaponController } from "ts/Controllers/Ship/WeaponController";
import { ThrustController } from "ts/Controllers/Ship/ThrustController";
import { ExplosionController } from "ts/Controllers/Ship/ExplosionController";

export class Ship {

    static createShipObj<TShip extends IShipData>(physics:TShip): SingleGameObject<ShapedModel<TShip, ShapeData>> {
        var triangleShip = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];
        Transforms.scale(triangleShip, 2, 2);
        
        var shape = new ShapeData(triangleShip);
        var ship = new ShapedModel<TShip, ShapeData>(physics, shape);

        var mover: IActor = new Mover(ship.data);
        var thrust = new ForwardAccelerator(ship.data);
        var rotator = new PolyRotator(ship.data, ship.shape);

        var actors: IActor[] = [mover, thrust, rotator];
        var shipView: IView = new PolyView(ship.data, ship.shape);

        var views: IView[] = [shipView];
        var shipObj = new SingleGameObject<ShapedModel<TShip, ShapeData>>(ship, actors, views);
        return shipObj;
    }
}