import { Transforms } from "ts/Physics/Transforms";
import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate, Vector } from "ts/Physics/Common";
// Data
import { ILocated } from "ts/Data/PhysicsData";
import { IShipData, SpaceShipData, LandingShipData } from "ts/Data/ShipData";
import { ShapeData } from "ts/Data/ShapeData";
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
import { Model, ShapedModel } from "ts/Models/DynamicModels";
// Views
import { IView } from "ts/Views/View";
import { PolyView } from "ts/Views/PolyViews";
// Updaters
import { IActor } from "ts/Actors/Actor";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Mover } from "ts/Actors/Movers";
import { PolyRotator } from "ts/Actors/Rotators";
import { ParticleGenerator, ParticleRemover } from "ts/Actors/ParticleFieldUpdater";
// Objects
import { Field } from "ts/GameObjects/ParticleField";
import { IGameObject, SingleGameObject, ComponentObjects, MultiGameObject } from "ts/GameObjects/GameObject";
import { IParticleWeaponController, BulletWeaponController } from "ts/Controllers/Ship/WeaponController";
import { IThrustController, ThrustController } from "ts/Controllers/Ship/ThrustController";
import { IExplosionController, ExplosionController } from "ts/Controllers/Ship/ExplosionController";


export interface IShipController {
    // methods
    left(timeModifier: number);
    right(timeModifier: number);
    thrust();
    noThrust();
}

export interface ICrashController {
    crash();
}

export interface IPrimaryWeaponController {
    shootPrimary();
}

export interface IShipComponents<TChassis extends IShipData> {
    chassisObj: SingleGameObject<ShapedModel<TChassis, ShapeData>>;
    weaponController: IParticleWeaponController;
    thrustController: IThrustController;
    explosionController: IExplosionController;
}


// Add overrides for landship
export class LandShipController extends ComponentObjects<IGameObject> implements IShipComponents<LandingShipData>, IShipController, ICrashController, IPrimaryWeaponController {

    constructor(public chassisObj: SingleGameObject<ShapedModel<LandingShipData, ShapeData>>,
        public weaponController: IParticleWeaponController,
        public thrustController: IThrustController,
        public explosionController: IExplosionController) {
        super([chassisObj, weaponController, thrustController, explosionController]);
    }

    thrust() {
        if (!this.chassisObj.model.physics.crashed) {
            this.chassisObj.model.physics.forwardForce = this.chassisObj.model.physics.maxForwardForce;
            this.thrustController.on();
        } else {
            this.noThrust();
        }
    }

    noThrust() {
        this.chassisObj.model.physics.forwardForce = 0;
        this.thrustController.off();
    }

    // TODO: break up ship
    crash() {
        if (!this.chassisObj.model.physics.crashed) {
            this.chassisObj.model.physics.crashed = true;
            this.explosionController.on();
            console.log("Your ship crashed!");
        }
    }

    shootPrimary() {
        if (!this.chassisObj.model.physics.crashed) this.weaponController.pullTrigger(this.chassisObj.model.physics, 0, 128);
    }

    left(lastTimeModifier: number) {
        this.chassisObj.model.physics.velX -= this.chassisObj.model.physics.leftRightSpeed * lastTimeModifier;
    }

    right(lastTimeModifier: number) {
        this.chassisObj.model.physics.velX += this.chassisObj.model.physics.leftRightSpeed * lastTimeModifier;
    }

    notMovingOnX(lastDrawModifier: number) {
        if (this.chassisObj.model.physics.velX < 0) {
            this.chassisObj.model.physics.velX += (this.chassisObj.model.physics.leftRightSlowing * lastDrawModifier);
            if (this.chassisObj.model.physics.velX >= 0) this.chassisObj.model.physics.velX = 0;
        }
        else if (this.chassisObj.model.physics.velX > 0) {
            this.chassisObj.model.physics.velX -= (this.chassisObj.model.physics.leftRightSlowing * lastDrawModifier);
            if (this.chassisObj.model.physics.velX < 0) this.chassisObj.model.physics.velX = 0;
        }
    }
}


// Controllers act like decorators to game objects. They provide an interface to interact with the game object.
export class SpaceShipController extends ComponentObjects<IGameObject> implements IShipComponents<SpaceShipData>, IShipController, ICrashController, IPrimaryWeaponController {

    constructor(public chassisObj: SingleGameObject<ShapedModel<SpaceShipData, ShapeData>>,
        public weaponController: IParticleWeaponController,
        public thrustController: IThrustController,
        public explosionController: IExplosionController) {
        super([chassisObj, weaponController, thrustController, explosionController]);
    }
    
    thrust() {
        if (!this.chassisObj.model.physics.crashed) {
            this.chassisObj.model.physics.forwardForce = this.chassisObj.model.physics.maxForwardForce;
            this.thrustController.on();
        } else {
            this.noThrust();
        }
    }

    noThrust() {
        this.chassisObj.model.physics.forwardForce = 0;
        this.thrustController.off();
    }
     
    // TODO: breakup ship - done
    crash() {
        if (!this.chassisObj.model.physics.crashed) {
            this.chassisObj.model.physics.crashed = true;
            this.explosionController.on();
            console.log("Your ship crashed!");
        }
    }

    left(lastTimeModifier: number) {
        if (!this.chassisObj.model.physics.crashed) this.chassisObj.model.physics.angle -= this.chassisObj.model.physics.maxRotationalSpeed * lastTimeModifier;
    }

    right(lastTimeModifier: number) {
        if (!this.chassisObj.model.physics.crashed) this.chassisObj.model.physics.angle += this.chassisObj.model.physics.maxRotationalSpeed * lastTimeModifier;
    }

    shootPrimary() {
        if (!this.chassisObj.model.physics.crashed) this.weaponController.pullTrigger(this.chassisObj.model.physics, 0, 128);
    }
}