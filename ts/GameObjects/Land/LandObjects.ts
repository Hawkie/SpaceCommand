import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { IShip, IFiringShip, StaticObject, TextObject } from "ts/GameObjects/Common/BaseObjects";
import { IShapeLocated, IShapeLocatedMoving, IShapeLocatedAngledMovingRotataing, IShapeLocatedAngledMovingRotataingAccelerating } from "../Models/PolyModels";
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { TextView } from "ts/Views/TextView";
import { TextModel } from "ts/Models/TextModel";
import { IPlanetSurfaceModel, PlanetSurfaceModel } from "ts/Models/Land/PlanetSurface";
import { IParticleModel, IParticleFieldModel, ParticleModel, ParticleFieldModel } from "ts/Models/ParticleFieldModel";
import { IShipModel } from "ts/Models/Ships/Ship";
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

export class PlanetSurface extends StaticObject<IPlanetSurfaceModel> {
    constructor(location: Coordinate) {
        var model: PlanetSurfaceModel = new PlanetSurfaceModel(location);
        var view: IView = new PolyView(model);
        super(model, [], [view]);
    }
}
