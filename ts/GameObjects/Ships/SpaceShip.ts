import { IShapeLocated, IShapeLocatedMoving, IShapeLocatedAngledMovingRotataing, IShapeLocatedAngledMovingRotataingAccelerating } from "ts/Models/PolyModels";
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { TextView } from "ts/Views/TextView";
import { TextModel } from "ts/Models/TextModel";
import { IParticleModel, IParticleFieldModel, ParticleModel, ParticleFieldModel } from "ts/Models/ParticleFieldModel";
import { ISpaceShipModel } from "ts/Models/Ships/Ship";
import { BasicShipModel, BasicShipActors } from "ts/Models/Ships/SpaceShipModel";
import { IWeapon, BasicGunModel } from "ts/Models/Weapons/Weapon";
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

export class BasicShip extends GameObject<ISpaceShipModel> implements IFiringShip {
    weaponModel: IWeapon;
    thrustParticles1: IParticleFieldModel;
    explosionParticles1: IParticleFieldModel;

    constructor(location: Coordinate, velx: number, vely: number, angle: number, spin: number) {
        var triangleShip = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];

        //data object
        var shipModel: BasicShipModel = new BasicShipModel(triangleShip, location, velx, vely, angle, spin);
        var shipActors: BasicShipActors = new BasicShipActors(shipModel);
        var shipView: IView = new PolyView(shipModel);

        var weaponModel = new BasicGunModel();
        var weaponView: IView = new ParticleFieldView(weaponModel, 1, 1);
        var weaponUpdater: IActor = new ParticleFieldMover(weaponModel);

        var thrustParticles1 = new ParticleFieldModel(20, 1, 0, false);
        var thrustView: ParticleFieldView = new ParticleFieldView(thrustParticles1, 1, 1);
        var thrustParticleGenerator: IActor = new ParticleGenerator(thrustParticles1,
            () => shipModel.location.x,
            () => shipModel.location.y,
            shipModel.thrustVelX.bind(shipModel),
            shipModel.thrustVelY.bind(shipModel));
        var thrustMover: IActor = new ParticleFieldMover(thrustParticles1);

        var explosionParticles1 = new ParticleFieldModel(50, 5, 0.2, false);
        var explosionView: ParticleFieldView = new ParticleFieldView(explosionParticles1, 3, 3);
        var explosionFieldUpdater: IActor = new ParticleGenerator(explosionParticles1,
            () => shipModel.location.x,
            () => shipModel.location.y,
            () => shipModel.velX + ((Math.random() - 0.5) * 20),
            () => shipModel.velY + ((Math.random() - 0.5) * 20));
        var explosionMover: IActor = new ParticleFieldMover(explosionParticles1);

        var actors: IActor[] = [shipActors, weaponUpdater, thrustParticleGenerator, thrustMover, explosionFieldUpdater, explosionMover];
        var views: IView[] = [shipView, weaponView, thrustView, explosionView];
        super(shipModel, actors, views);
        this.weaponModel = weaponModel;
        this.thrustParticles1 = thrustParticles1;
        this.explosionParticles1 = explosionParticles1;
    }

    // MOve these to an interactor
    thrust() {
        //var audio = new Audio("./wav/thrust.wav");
        //audio.play();
        if (!this.model.crashed) {
            this.model.forwardForce = this.model.maxForwardForce;
            this.thrustParticles1.turnOn();
        }
    }

    noThrust() {
        this.model.forwardForce = 0;
        this.thrustParticles1.turnOff();
    }
    
    // TODO: flash screen white. 
    // remove ship - done
    // turn on explosionParticles - done
    crash() {
        this.model.crashed = true;
        this.explosionParticles1.turnOn();
        console.log("Your ship crashed!");
    }

    left(lastTimeModifier: number) {
        if (!this.model.crashed) this.model.angle -= this.model.maxRotationalSpeed * lastTimeModifier;
    }

    right(lastTimeModifier: number) {
        if (!this.model.crashed) this.model.angle += this.model.maxRotationalSpeed * lastTimeModifier;
    }

    shootPrimary() {
        if (!this.model.crashed) this.weaponModel.pullTrigger(this.model.location.x, this.model.location.y, this.model.angle);
    }
}

export class BasicGun extends GameObject<IParticleFieldModel> {
    constructor() {
        var model: IParticleFieldModel = new BasicGunModel();
        var view: IView = new ParticleFieldView(model, 1, 1);
        super(model, [], [view]);
    }
}