import { IShapeLocated, IShapeLocatedMoving, IShapeLocatedAngledMovingRotataing, IShapeLocatedAngledMovingRotataingAccelerating } from "ts/Models/PolyModels";
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { TextView } from "ts/Views/TextView";
import { TextModel } from "ts/Models/TextModel";
import { IParticleModel, IParticleFieldModel, ParticleModel, ParticleFieldModel } from "ts/Models/ParticleFieldModel";
import { IShipModel, BasicShipModel, IShip, IFiringShip } from "ts/Models/Ships/Ship";
import { LandingBasicShipModel } from "ts/Models/Ships/LandingShip";
import { LandingPadModel } from "ts/Models/Land/LandingPad";
import { AsteroidModel } from "ts/Models/Space/Asteroid";
import { IWeapon, BasicGunModel } from "ts/Models/Weapons/Weapon";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { ParticleFieldUpdater, ParticleFieldMover } from "ts/Actors/ParticleFieldUpdater";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator, Spinner } from "ts/Actors/Rotators";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";

import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { MovingObject, MovingSpinningObject, MovingSpinningThrustingObject, StaticObject, TextObject } from "ts/GameObjects/Common/BaseObjects";
 
// todo: break down into single objects and composite objects
// single objects have simpler constructor
// composite objects

export class BasicShip extends MovingSpinningThrustingObject<IShipModel> implements IFiringShip {
    weaponModel: IWeapon;
    thrustParticles1: IParticleFieldModel;
    explosionParticles1: IParticleFieldModel;

    constructor(location: Coordinate, velx: number, vely: number, angle: number, spin: number) {
        var triangleShip = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];

        //data object
        var shipModel: BasicShipModel = new BasicShipModel(triangleShip, location, velx, vely, angle, spin);
        var shipView: IView = new PolyView(shipModel);
        var shipRotator

        var weaponModel = new BasicGunModel();
        var weaponView: IView = new ParticleFieldView(weaponModel, 1, 1);
        var weaponUpdater: IActor = new ParticleFieldMover(weaponModel);

        var thrustParticles1 = new ParticleFieldModel(20, 1, 0, false);
        var thrustView: ParticleFieldView = new ParticleFieldView(thrustParticles1, 1, 1);
        var thrustFieldUpdater: IActor = new ParticleFieldUpdater(thrustParticles1, shipModel.startFromX.bind(shipModel), shipModel.startFromY.bind(shipModel), shipModel.thrustVelX.bind(shipModel), shipModel.thrustVelY.bind(shipModel));

        var explosionParticles1 = new ParticleFieldModel(50, 5, 0.2, false);
        var explosionView: ParticleFieldView = new ParticleFieldView(explosionParticles1, 3, 3);
        var explosionFieldUpdater: IActor = new ParticleFieldUpdater(explosionParticles1, shipModel.startFromX.bind(shipModel), shipModel.startFromY.bind(shipModel), shipModel.explosionX.bind(shipModel), shipModel.explosionY.bind(shipModel));

        var actors: IActor[] = [weaponUpdater, thrustFieldUpdater, explosionFieldUpdater];
        var views: IView[] = [shipView, weaponView, thrustView, explosionView]
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

export class Asteroid extends MovingSpinningObject<AsteroidModel> {
    // 5 different asteroid shapes
    //  [-4,-2,-2,-4,0,-2,2,-4,4,-2,3,0,4,2,1,4,-2,4,-4,2,-4,-2],
    // 	[-3,0,-4,-2,-2,-4,0,-3,2,-4,4,-2,2,-1,4,1,2,4,-1,3,-2,4,-4,2,-3,0],
    // 	[-2,0,-4,-1,-1,-4,2,-4,4,-1,4,1,2,4,0,4,0,1,-2,4,-4,1,-2,0],
    // 	[-1,-2,-2,-4,1,-4,4,-2,4,-1,1,0,4,2,2,4,1,3,-2,4,-4,1,-4,-2,-1,-2],
    // 	[-4,-2,-2,-4,2,-4,4,-2,4,2,2,4,-2,4,-4,2,-4,-2]
    constructor(location: Coordinate, velx: number, vely: number, angle: number, spin: number) {

        var asteroid1 = [new Coordinate(-4, -2),
            new Coordinate(-2, -4),
            new Coordinate(0, -2),
            new Coordinate(2, -4),
            new Coordinate(4, -2),
            new Coordinate(3, 0),
            new Coordinate(4, 2),
            new Coordinate(1, 3),
            new Coordinate(-2, 4),
            new Coordinate(-4, 2),
            new Coordinate(-4, -2),
        ];
        var rectangle1 = [new Coordinate(- 2, -20),
            new Coordinate(2, -20),
            new Coordinate(2, 20),
            new Coordinate(-2, 20),
            new Coordinate(-2, -20)];
        var model: AsteroidModel = new AsteroidModel(rectangle1, location, velx, vely, angle, spin);
        var view: PolyView = new PolyView(model);
        super(model, [], [view]);
    }

    // move to collision actor
    hitTest(bullet: Coordinate): boolean {
        // for now, we accelerate and spin the asteroid when hit
        if (Transforms.hasPoint(this.model.points, this.model.location, bullet)) {
            return true;
        }
        return false;
    }

    hit() {
        this.model.velX += 2;
        this.model.spin += 1;
    }
}

