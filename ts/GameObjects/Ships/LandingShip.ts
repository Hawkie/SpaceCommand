import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { TextObject } from "ts/GameObjects/Common/BaseObjects";
import { IModel, DynamicModel } from "ts/Models/DynamicModels";
import { IShip } from "ts/GameObjects/Ships/Ship";
import { IShapeLocated, IShapeLocatedMoving, IShapeLocatedAngledMovingRotataing, IShapeLocatedAngledMovingRotataingAccelerating } from "../Models/PolyModels";
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { TextView } from "ts/Views/TextView";
import { TextData } from "ts/Models/TextModel";
import { IParticleData, IParticleFieldData, ParticleData, ParticleFieldData, MovingGravityParticleModel } from "ts/Models/ParticleFieldModel";
import { IShipData } from "ts/Models/Ships/Ship";
import { LandingBasicShipData } from "ts/Models/Ships/LandingShip";
import { IWeaponData, WeaponData } from "ts/Models/Weapons/Weapon";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { ParticleGenerator, ParticleFieldMover } from "ts/Actors/ParticleFieldUpdater";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator, Spinner } from "ts/Actors/Rotators";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";


export class LandingBasicShip extends GameObject<LandingBasicShipData> implements IShip {

    crashed: boolean;
    thrustParticles1: IParticleFieldData;
    explosionParticles1: IParticleFieldData;

    constructor(location: Coordinate) {

        let triangleShip = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];
        var shipModel: IModel<LandingBasicShipData> = new DynamicModel<LandingBasicShipData>(new LandingBasicShipData(triangleShip, location));
        var shipView: IView = new PolyView(shipModel.data);

        var thrustParticles1 = new ParticleFieldData(20, 1, 0, false);
        var thrustView: ParticleFieldView = new ParticleFieldView(thrustParticles1, 1, 1);
        var thrustParticleGenerator: IActor = new ParticleGenerator(thrustParticles1,
            (now: number) => new MovingGravityParticleModel(new ParticleData(shipModel.data.location.x,
                shipModel.data.location.y,
                shipModel.data.thrustVelX(),
                shipModel.data.thrustVelY(),
                now)));
        var thrustMover: IActor = new ParticleFieldMover(thrustParticles1);

        var explosionParticles1 = new ParticleFieldData(100, 5, 0.2, false);
        var explosionView: ParticleFieldView = new ParticleFieldView(explosionParticles1, 3, 3);
        var explosionFieldUpdater: IActor = new ParticleGenerator(explosionParticles1,
            (now: number) => new MovingGravityParticleModel(new ParticleData(shipModel.data.location.x,
                shipModel.data.location.y,
                (Math.random() - 0.5) * 20,
                (Math.random() * -30),
                now)));
        var explosionMover: IActor = new ParticleFieldMover(explosionParticles1);


        var mover: IActor = new Mover(shipModel.data);
        var thrust = new ForwardAccelerator(shipModel.data);
        var gravityForce = new VectorAccelerator(shipModel.data, new Vector(180, 10));

        super(shipModel, [mover, thrust, gravityForce, thrustParticleGenerator, thrustMover, explosionFieldUpdater, explosionMover], [shipView, thrustView, explosionView]);
        this.crashed = false;
        this.thrustParticles1 = thrustParticles1;
        this.explosionParticles1 = explosionParticles1;
    }

    // Move to Model
    thrust() {
        // TODO: Play thrust sfx
        if (!this.crashed) {
            this.model.data.forwardForce = this.model.data.maxForwardForce;
            this.thrustParticles1.turnOn();
        }
    }

    noThrust() {
        this.model.data.forwardForce = 0;
        this.thrustParticles1.turnOff();
    }

    crash() {
        this.crashed = true;
        this.explosionParticles1.turnOn();
        console.log("Your crashed your ship while landing!");
    }

    left(lastTimeModifier: number) {
        this.model.data.velX -= this.model.data.leftRightSpeed * lastTimeModifier;
    }

    right(lastTimeModifier: number) {
        this.model.data.velX += this.model.data.leftRightSpeed * lastTimeModifier;
    }

    notMovingOnX(lastDrawModifier: number) {
        if (this.model.data.velX < 0) {
            this.model.data.velX += (this.model.data.leftRightSlowing * lastDrawModifier);
            if (this.model.data.velX >= 0) this.model.data.velX = 0;
        }
        else if (this.model.data.velX > 0) {
            this.model.data.velX -= (this.model.data.leftRightSlowing * lastDrawModifier);
            if (this.model.data.velX < 0) this.model.data.velX = 0;
        }
    }
}