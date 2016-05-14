
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
import { ParticleGenerator, ParticleFieldMover } from "ts/Actors/ParticleFieldUpdater";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator, Spinner } from "ts/Actors/Rotators";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";

import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { MovingObject, MovingSpinningObject, MovingSpinningThrustingObject, StaticObject, TextObject } from "ts/GameObjects/Common/BaseObjects";


export class ParticleField extends GameObject<IParticleFieldModel> {
    constructor(model: IParticleFieldModel, startx: () => number, starty: () => number, velx: () => number, vely: () => number, sizeX: number = 1, sizeY: number = 1) {
        var view: ParticleFieldView = new ParticleFieldView(model, sizeX, sizeY);
        var generator: IActor = new ParticleGenerator(model, startx, starty, velx, vely);
        var mover = new ParticleFieldMover(model);
        super(model, [generator, mover], [view]);
    }
}
