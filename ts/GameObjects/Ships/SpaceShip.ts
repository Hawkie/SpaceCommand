import { IShapeLocated, IShapeLocatedMoving, IShapeLocatedAngledMovingRotataing, IShapeLocatedAngledMovingRotataingAccelerating } from "ts/Models/PolyModels";
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { TextView } from "ts/Views/TextView";
import { TextData } from "ts/Models/TextModel";
import { IParticleData, IParticleFieldData, ParticleData, ParticleFieldData, MovingParticleModel } from "ts/Models/ParticleFieldModel";
import { ISpaceShipData } from "ts/Models/Ships/Ship";
import { BasicShipData, BasicShipModel } from "ts/Models/Ships/SpaceShipModel";
import { IWeaponData, WeaponData } from "ts/Models/Weapons/Weapon";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { ParticleGenerator, ParticleFieldMover } from "ts/Actors/ParticleFieldUpdater";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator, Spinner } from "ts/Actors/Rotators";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";
import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { TextObject } from "ts/GameObjects/Common/BaseObjects";
import { IShip, IFiringShip } from "ts/GameObjects/Ships/Ship";

 
// todo: break down into single objects and composite objects
// single objects have simpler constructor
// composite objects

export class BasicShip extends GameObject<ISpaceShipData> implements IFiringShip {
    weaponModel: IWeaponData;
    thrustParticles1: IParticleFieldData;
    explosionParticles1: IParticleFieldData;

    constructor(location: Coordinate, velx: number, vely: number, angle: number, spin: number) {
        var triangleShip = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];

        //data object
        var shipModel: BasicShipModel = new BasicShipModel(new BasicShipData(triangleShip, location, velx, vely, angle, spin));
        var shipView: IView = new PolyView(shipModel.data);

        var weaponModel: IWeaponData = new WeaponData();
        var weaponUpdater: IActor = new ParticleFieldMover(weaponModel);
        var weaponView: IView = new ParticleFieldView(weaponModel, 1, 1);
        
        var thrustParticles1 = new ParticleFieldData(20, 1, 0, false);
        var thrustView: ParticleFieldView = new ParticleFieldView(thrustParticles1, 1, 1);
        var thrustParticleGenerator: IActor = new ParticleGenerator(thrustParticles1,
            (now: number) => new MovingParticleModel(new ParticleData(shipModel.data.location.x,
                shipModel.data.location.y,
                shipModel.data.thrustVelX(),
                shipModel.data.thrustVelY(),
                now)));
        var thrustMover: IActor = new ParticleFieldMover(thrustParticles1);

        var explosionParticles1 = new ParticleFieldData(50, 5, 0.2, false);
        var explosionView: ParticleFieldView = new ParticleFieldView(explosionParticles1, 3, 3);
        var explosionFieldUpdater: IActor = new ParticleGenerator(explosionParticles1,
            (now: number) => new MovingParticleModel(new ParticleData(shipModel.data.location.x,
                shipModel.data.location.y,
                shipModel.data.velX + ((Math.random() - 0.5) * 20),
                shipModel.data.velY + ((Math.random() - 0.5) * 20),
                now)));
        var explosionMover: IActor = new ParticleFieldMover(explosionParticles1);

        var actors: IActor[] = [weaponUpdater, thrustParticleGenerator, thrustMover, explosionFieldUpdater, explosionMover];
        var views: IView[] = [shipView, weaponView, thrustView, explosionView];
        super(shipModel, actors, views);
        this.weaponModel = weaponModel;
        this.thrustParticles1 = thrustParticles1;
        this.explosionParticles1 = explosionParticles1;
    }

    // TODO: MOve these to model
    thrust() {
        //var audio = new Audio("./wav/thrust.wav");
        //audio.play();
        if (!this.model.data.crashed) {
            this.model.data.forwardForce = this.model.data.maxForwardForce;
            this.thrustParticles1.turnOn();
        }
    }

    noThrust() {
        this.model.data.forwardForce = 0;
        this.thrustParticles1.turnOff();
    }
    
    // TODO: flash screen white. 
    // remove ship - done
    // turn on explosionParticles - done
    crash() {
        this.model.data.crashed = true;
        this.explosionParticles1.turnOn();
        console.log("Your ship crashed!");
    }

    left(lastTimeModifier: number) {
        if (!this.model.data.crashed) this.model.data.angle -= this.model.data.maxRotationalSpeed * lastTimeModifier;
    }

    right(lastTimeModifier: number) {
        if (!this.model.data.crashed) this.model.data.angle += this.model.data.maxRotationalSpeed * lastTimeModifier;
    }

    shootPrimary() {
        if (!this.model.data.crashed) this.weaponModel.pullTrigger(this.model.data.location.x, this.model.data.location.y, this.model.data.angle);
    }
}