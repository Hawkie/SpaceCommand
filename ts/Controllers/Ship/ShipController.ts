import { Transforms } from "ts/Physics/Transforms";
import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate, Vector } from "ts/Physics/Common";
// data
import { ILocated } from "ts/Data/PhysicsData";
// import { IShipData, SpaceShipData, LandingShipData } from "ts/Data/ShipData";
import { ShapeData } from "ts/Data/ShapeData";
import { ShapedModel } from "ts/Models/DynamicModels";
// views
import { IView } from "ts/Views/View";
import { PolyView } from "ts/Views/PolyViews";
// updaters
import { IActor } from "ts/Actors/Actor";
import { PolyRotator } from "ts/Actors/Rotators";
// objects
import { Field } from "ts/GameObjects/ParticleField";
import { IGameObject, SingleGameObject, ComponentObjects, MultiGameObject, IObject } from "ts/GameObjects/GameObject";
import { IWeaponController, WeaponController } from "ts/Controllers/Ship/WeaponController";
import { IThrustController, ThrustController } from "ts/Controllers/Ship/ThrustController";
import { IExplosionController, ExplosionController } from "ts/Controllers/Ship/ExplosionController";
import { IShip } from "./ShipComponents";


export interface IChassisController {
    left(timeModifier: number): void;
    right(timeModifier: number): void;
    crash(): void;
}

export interface IShipComponents {
    shipController: IChassisController;
    weaponController: IWeaponController;
    thrustController: IThrustController;
    explosionController: IExplosionController;

    // methods
    left(timeModifier: number): void;
    right(timeModifier: number): void;
    thrust(): void;
    noThrust(): void;
    crash(): void;
}


// add overrides for landship
// export class LandShipController extends ComponentObjects<IGameObject>
// implements IShipComponents<LandingShipData>, IShipController, ICrashController, IPrimaryWeaponController {

//     constructor(public shipData: LandingShipData,
//         public chassisObj: ShipComponentObject,
//         public weaponController: IParticleWeaponController,
//         public thrustController: IThrustController,
//         public explosionController: IExplosionController) {
//         super([chassisObj, weaponController, thrustController, explosionController]);
//     }

//     thrust() {
//         if (!this.shipData.crashed) {
//             this.shipData.forces[0].length = this.shipData.maxForwardForce;
//             this.thrustController.on();
//         } else {
//             this.noThrust();
//         }
//     }

//     noThrust() {
//         this.shipData.forces[0].length = 0;
//         this.thrustController.off();
//     }

//     // TODO: break up ship
//     crash(): void {
//         if (!this.shipData.crashed) {
//             this.shipData.crashed = true;
//             this.explosionController.on();
//             console.log("Your ship crashed!");
//         }
//     }

//     shootPrimary(): void {
//         if (!this.shipData.crashed) {
//             this.weaponController.pullTrigger(this.shipData, 0, 128);
//         }
//     }

//     left(lastTimeModifier: number): void {
//         this.shipData.velX -= this.shipData.leftRightSpeed * lastTimeModifier;
//     }

//     right(lastTimeModifier: number): void {
//         this.shipData.velX += this.shipData.leftRightSpeed * lastTimeModifier;
//     }

//     notMovingOnX(lastDrawModifier: number) {
//         if (this.shipData.velX < 0) {
//             this.shipData.velX += (this.shipData.leftRightSlowing * lastDrawModifier);
//             if (this.shipData.velX >= 0) this.shipData.velX = 0;
//         }
//         else if (this.shipData.velX > 0) {
//             this.shipData.velX -= (this.shipData.leftRightSlowing * lastDrawModifier);
//             if (this.shipData.velX < 0) this.shipData.velX = 0;
//         }
//     }
// }

export class ChassisController implements IChassisController {

    left(lastTimeModifier: number): void {
        if (!this.model.crashed) {
            this.model.angle -= this.model.maxRotationalSpeed * lastTimeModifier;
            // keep thrust vector in line with ship angle
            this.model.thrust.angle = this.model.angle;
        }
    }

    right(lastTimeModifier: number): void {
        if (!this.model.crashed) {
            this.model.angle += this.model.maxRotationalSpeed * lastTimeModifier;
            // keep thrust vector in line with ship angle
            this.model.thrust.angle = this.model.angle;
        }
    }

    // tODO: breakup ship - done
    crash(): void {
        if (!this.model.crashed) {
            this.model.crashed = true;
            console.log("Your ship crashed!");
        }
    }
}

// controllers act like decorators to game objects. They provide an interface to interact with the game object.
export class SpaceShipController extends ComponentObjects<IGameObject> implements IShipComponents {

    constructor(public shipController: IChassisController,
        public weaponController: IWeaponController,
        public thrustController: IThrustController,
        public explosionController: IExplosionController) {
        super([shipController, weaponController, thrustController, explosionController]);
    }

    thrust(): void {
        if (!this.shipController.model.crashed) {
            this.shipController.model.thrust.length = this.shipController.model.maxForwardForce;
            this.thrustController.on();
        } else {
            this.noThrust();
        }
    }

    noThrust(): void {
        this.shipController.model.thrust.length = 0;
        this.thrustController.off();
    }

    left(lastTimeModifier: number): void {
        if (!this.shipController.model.crashed) {
            this.shipController.left(lastTimeModifier);
        }
    }

    right(lastTimeModifier: number): void {
        if (!this.shipController.model.crashed) {
            this.shipController.right(lastTimeModifier);
        }
    }

    shootPrimary(): void {
        if (!this.shipController.model.crashed) {
            this.weaponController.pullTrigger();
        }
    }

    // tODO: breakup ship - done
    crash(): void {
        if (!this.shipController.crash()) {
            this.explosionController.on();
            console.log("Your ship crashed!");
        }
    }

    // tether to ball if within range
    // hook() {
    //    if (!this.shipData.crashed)

    // untether to ball if within range
    // unhook() {
    //    if (!this.shipData.crashed)

}