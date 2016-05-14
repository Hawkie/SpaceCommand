
import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { StaticObject, TextObject } from "ts/GameObjects/Common/BaseObjects";
import { IShapeLocated, IShapeLocatedMoving, IShapeLocatedAngledMovingRotataing, IShapeLocatedAngledMovingRotataingAccelerating } from "../Models/PolyModels";
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { TextView } from "ts/Views/TextView";
import { TextModel } from "ts/Models/TextModel";
import { IPlanetSurfaceModel, PlanetSurfaceModel } from "ts/Models/Land/PlanetSurface";
import { IParticleModel, IParticleFieldModel, ParticleModel, ParticleFieldModel } from "ts/Models/ParticleFieldModel";
import { IShipModel, BasicShipModel, IShip, IFiringShip } from "ts/Models/Ships/Ship";
import { LandingBasicShipModel } from "ts/Models/Ships/LandingShip";
import { LandingPadModel } from "ts/Models/Land/LandingPad";
import { IWeapon, BasicGunModel } from "ts/Models/Weapons/Weapon";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { ParticleGenerator, ParticleFieldMover } from "ts/Actors/ParticleFieldUpdater";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator, Spinner } from "ts/Actors/Rotators";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";


export class LandingPad extends GameObject<LandingPadModel> {
    constructor(model: IShapeLocated) {
        var view: IView = new PolyView(model);
        super(model, [], [view]);
    }

    

}
// TODO need to add LandingPadView to PlanetSurface
export class PlanetSurface extends StaticObject<IPlanetSurfaceModel> {
    constructor(location: Coordinate) {
        var model: PlanetSurfaceModel = new PlanetSurfaceModel(location);
        var view: IView = new PolyView(model);
        super(model, [], [view]);
    }
}


export class LandingBasicShip extends GameObject<LandingBasicShipModel> implements IShip {

    crashed: boolean;
    thrustParticles1: IParticleFieldModel;
    explosionParticles1: IParticleFieldModel;

    constructor(location: Coordinate) {

        let triangleShip = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];
        var shipModel: LandingBasicShipModel = new LandingBasicShipModel(triangleShip, location);
        var shipView: IView = new PolyView(shipModel);

        var thrustParticles1 = new ParticleFieldModel(20, 1, 0, false);
        var thrustView: ParticleFieldView = new ParticleFieldView(thrustParticles1, 1, 1);
        var thrustParticleGenerator: IActor = new ParticleGenerator(thrustParticles1,
            () => shipModel.location.x,
            () => shipModel.location.y,
            shipModel.thrustVelX.bind(shipModel),
            shipModel.thrustVelY.bind(shipModel));
        var thrustMover: IActor = new ParticleFieldMover(thrustParticles1);

        var explosionParticles1 = new ParticleFieldModel(100, 5, 0.2, false);
        var explosionView: ParticleFieldView = new ParticleFieldView(explosionParticles1, 3, 3);
        var explosionFieldUpdater: IActor = new ParticleGenerator(explosionParticles1,
            () => shipModel.location.x,
            () => shipModel.location.y,
            () => ((Math.random() - 0.5) * 20),
            () => ((Math.random()) * -30));
        var explosionMover: IActor = new ParticleFieldMover(explosionParticles1, true);


        var mover: IActor = new Mover(shipModel);
        var thrust = new ForwardAccelerator(shipModel);
        var gravityForce = new VectorAccelerator(shipModel, new Vector(180, 10));

        super(shipModel, [mover, thrust, gravityForce, thrustParticleGenerator, thrustMover, explosionFieldUpdater, explosionMover], [shipView, thrustView, explosionView]);
        this.crashed = false;
        this.thrustParticles1 = thrustParticles1;
        this.explosionParticles1 = explosionParticles1;
    }

    // Move to Model
    thrust() {
        // TODO: Play thrust sfx
        if (!this.crashed) {
            this.model.forwardForce = this.model.maxForwardForce;
            this.thrustParticles1.turnOn();
        }
    }

    noThrust() {
        this.model.forwardForce = 0;
        this.thrustParticles1.turnOff();
    }

    crash() {
        this.crashed = true;
        this.explosionParticles1.turnOn();
        console.log("Your crashed your ship while landing!");
    }

    left(lastTimeModifier: number) {
        this.model.velX -= this.model.leftRightSpeed * lastTimeModifier;
    }

    right(lastTimeModifier: number) {
        this.model.velX += this.model.leftRightSpeed * lastTimeModifier;
    }

    notMovingOnX(lastDrawModifier: number) {
        if (this.model.velX < 0) {
            this.model.velX += (this.model.leftRightSlowing * lastDrawModifier);
            if (this.model.velX >= 0) this.model.velX = 0;
        }
        else if (this.model.velX > 0) {
            this.model.velX -= (this.model.leftRightSlowing * lastDrawModifier);
            if (this.model.velX < 0) this.model.velX = 0;
        }
    }
}