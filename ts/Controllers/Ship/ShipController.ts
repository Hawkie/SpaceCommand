import { Transforms } from "ts/Physics/Transforms";
import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate, Vector } from "ts/Physics/Common";
// Data
import { ILocated } from "ts/Data/PhysicsData";
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
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
import { Field } from "ts/GameObjects/ParticleField";
import { ParticleGenerator, ParticleRemover } from "ts/Actors/ParticleFieldUpdater";
import { IGameObject, SingleGameObject, ComponentObjects, MultiGameObject } from "ts/GameObjects/GameObject";
import { WeaponController } from "ts/Controllers/Ship/WeaponController";
import { ThrustController } from "ts/Controllers/Ship/ThrustController";
import { ExplosionController } from "ts/Controllers/Ship/ExplosionController";


export interface IShipController {
    // methods
    left(timeModifier: number);
    right(timeModifier: number);
}

export interface ICrashController {
    crash();
}

export interface IThrustController {
    thrust();
    noThrust();
}

export interface IWeaponController {
    shootPrimary();
}

// Add overrides for landship
export class LandShipController extends ComponentObjects<IGameObject> implements IShipController, ICrashController, IThrustController, IWeaponController {

    constructor(public shipObj: MultiGameObject<ShapedModel<LandingShipData, ShapeData>, IGameObject>,
        public weaponController: WeaponController,
        public thrustController: ThrustController,
        public explosionController: ExplosionController) {
        super([thrustController, weaponController, explosionController, shipObj]);
    }

    thrust() {
        if (!this.shipObj.model.data.crashed) {
            this.shipObj.model.data.forwardForce = this.shipObj.model.data.maxForwardForce;
            this.thrustController.on();
        } else {
            this.noThrust();
        }
    }

    noThrust() {
        this.shipObj.model.data.forwardForce = 0;
        this.thrustController.off();
    }

    // TODO: break up ship
    crash() {
        if (!this.shipObj.model.data.crashed) {
            this.shipObj.model.data.crashed = true;
            this.explosionController.on();
            console.log("Your ship crashed!");
        }
    }

    shootPrimary() {
        if (!this.shipObj.model.data.crashed) this.weaponController.pullTrigger(this.shipObj.model.data, 0, 128);
    }

    left(lastTimeModifier: number) {
        this.shipObj.model.data.velX -= this.shipObj.model.data.leftRightSpeed * lastTimeModifier;
    }

    right(lastTimeModifier: number) {
        this.shipObj.model.data.velX += this.shipObj.model.data.leftRightSpeed * lastTimeModifier;
    }

    notMovingOnX(lastDrawModifier: number) {
        if (this.shipObj.model.data.velX < 0) {
            this.shipObj.model.data.velX += (this.shipObj.model.data.leftRightSlowing * lastDrawModifier);
            if (this.shipObj.model.data.velX >= 0) this.shipObj.model.data.velX = 0;
        }
        else if (this.shipObj.model.data.velX > 0) {
            this.shipObj.model.data.velX -= (this.shipObj.model.data.leftRightSlowing * lastDrawModifier);
            if (this.shipObj.model.data.velX < 0) this.shipObj.model.data.velX = 0;
        }
    }
}


// Controllers act like decorators to game objects. They provide an interface to interact with the game object.
export class SpaceShipController extends ComponentObjects<IGameObject> implements IShipController, ICrashController, IThrustController, IWeaponController {

    constructor(public shipObj: MultiGameObject<ShapedModel<SpaceShipData, ShapeData>, IGameObject>,
        public weaponController: WeaponController,
        public thrustController: ThrustController,
        public explosionController: ExplosionController) {
        super([thrustController, weaponController, explosionController, shipObj]);
    }
    
    thrust() {
        if (!this.shipObj.model.data.crashed) {
            this.shipObj.model.data.forwardForce = this.shipObj.model.data.maxForwardForce;
            this.thrustController.on();
        } else {
            this.noThrust();
        }
    }

    noThrust() {
        this.shipObj.model.data.forwardForce = 0;
        this.thrustController.off();
    }
     
    // TODO: breakup ship - done
    crash() {
        if (!this.shipObj.model.data.crashed) {
            this.shipObj.model.data.crashed = true;
            this.explosionController.on();
            console.log("Your ship crashed!");
        }
    }

    left(lastTimeModifier: number) {
        if (!this.shipObj.model.data.crashed) this.shipObj.model.data.angle -= this.shipObj.model.data.maxRotationalSpeed * lastTimeModifier;
    }

    right(lastTimeModifier: number) {
        if (!this.shipObj.model.data.crashed) this.shipObj.model.data.angle += this.shipObj.model.data.maxRotationalSpeed * lastTimeModifier;
    }

    shootPrimary() {
        if (!this.shipObj.model.data.crashed) this.weaponController.pullTrigger(this.shipObj.model.data, 0, 128);
    }
}