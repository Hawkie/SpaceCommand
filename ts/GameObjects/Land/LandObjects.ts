
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
import { ParticleFieldUpdater, ParticleFieldMover } from "ts/Actors/ParticleFieldUpdater";
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
    constructor(location: Coordinate) {

        let triangleShip = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];
        var shipModel: LandingBasicShipModel = new LandingBasicShipModel(triangleShip, location);
        var shipView: IView = new PolyView(shipModel);

        var mover: IActor = new Mover(shipModel);
        var thrust = new ForwardAccelerator(shipModel);
        var gravityForce = new VectorAccelerator(shipModel, new Vector(180, 10));
        super(shipModel, [mover, thrust, gravityForce], [shipView]);
        this.crashed = false;
    }

    // Move to Model
    thrust() {
        // TODO: Play thrust sfx
        if (!this.crashed) {
            this.model.forwardForce = this.model.maxForwardForce;
        }
    }

    noThrust() {
        this.model.forwardForce = 0;
    }

    crash() {
        this.crashed = true;
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