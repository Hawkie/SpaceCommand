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
import { IShipController, ICrashController, IThrustController, IWeaponController, SpaceShipController, LandShipController } from "ts/Controllers/Ship/ShipController";
import { WeaponController } from "ts/Controllers/Ship/WeaponController";
import { ThrustController } from "ts/Controllers/Ship/ThrustController";
import { ExplosionController } from "ts/Controllers/Ship/ExplosionController";

export class Ship {
    static createLandShipController(location: Coordinate,
        velx: number,
        vely: number,
        angle: number,
        spin: number,
        getWeapon: (shipObj: MultiGameObject<ShapedModel<LandingShipData, ShapeData>, IGameObject>) => WeaponController,
        getThrust: (shipObj: MultiGameObject<ShapedModel<LandingShipData, ShapeData>, IGameObject>) => ThrustController,
        getExplosion: (shipObj: MultiGameObject<ShapedModel<LandingShipData, ShapeData>, IGameObject>) => ExplosionController)
        :
        LandShipController {
        var physics = new LandingShipData(location);
        var shipObj = Ship.createShipObj(physics);
        var gravityForce = new VectorAccelerator(shipObj.model.data, new Vector(180, 10));
        shipObj.actors.push(gravityForce);

        // Add components
        var weapon = getWeapon(shipObj);
        var thrust = getThrust(shipObj);
        var explosion = getExplosion(shipObj);
        //var components: IGameObject[] = [weapon.field, thrust.field, explosion.field];
        //shipObj.components = components;

        let ship: LandShipController = new LandShipController(shipObj, weapon, thrust, explosion);
        return ship;
    }

    static createSpaceShipController(
        location: Coordinate,
        velx: number,
        vely: number,
        angle: number,
        spin: number,
        getWeapon: (shipObj: MultiGameObject<ShapedModel<SpaceShipData, ShapeData>, IGameObject>) => WeaponController,
        getThrust: (shipObj: MultiGameObject<ShapedModel<SpaceShipData, ShapeData>, IGameObject>) => ThrustController,
        getExplosion: (shipObj: MultiGameObject<ShapedModel<SpaceShipData, ShapeData>, IGameObject>) => ExplosionController)
    :
        SpaceShipController {
        var spaceShip = new SpaceShipData(location, velx, vely, angle, spin)
        var shipObj = Ship.createShipObj(spaceShip);

        // Add components
        var weapon = getWeapon(shipObj);
        var thrust = getThrust(shipObj);
        var explosion = getExplosion(shipObj);
        //var components: IGameObject[] = [weapon.field, thrust.field, explosion.field];
        //shipObj.components  = components;

        // Add Controller
        var shipController = new SpaceShipController(shipObj, weapon, thrust, explosion);
        return shipController;
    }

    static createShipObj<TShip extends IShipData>(physics:TShip): MultiGameObject<ShapedModel<TShip, ShapeData>, IGameObject> {
        var triangleShip = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];
        Transforms.scale(triangleShip, 2, 2);
        
        var shape = new ShapeData(triangleShip);
        var ship = new ShapedModel<TShip, ShapeData>(physics, shape);

        //var engineShape = [];
        //var engine = new ShapedModel<TShip, ShapeData>(physics, shape);

        var mover: IActor = new Mover(ship.data);
        var thrust = new ForwardAccelerator(ship.data);
        var rotator = new PolyRotator(ship.data, ship.shape);

        var actors: IActor[] = [mover, thrust, rotator];
        var shipView: IView = new PolyView(ship.data, ship.shape);

        var views: IView[] = [shipView];
        var shipObj = new MultiGameObject<ShapedModel<TShip, ShapeData>, IGameObject>(ship, actors, views);
        return shipObj;
    }
}