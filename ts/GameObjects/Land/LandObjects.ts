﻿import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { TextObject } from "ts/GameObjects/Common/BaseObjects";
import { IShapeLocated, IShapeLocatedMoving, IShapeLocatedAngledMovingRotataing, IShapeLocatedAngledMovingRotataingAccelerating } from "../Models/PolyModels";
import { IModel, DynamicModel } from "ts/Models/DynamicModels";
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { TextView } from "ts/Views/TextView";
import { TextData } from "ts/Models/TextModel";
import { IPlanetSurfaceData, PlanetSurfaceData } from "ts/Models/Land/PlanetSurface";
import { LandingPadData } from "ts/Models/Land/LandingPad";
import { IWeaponData, WeaponData } from "ts/Models/Weapons/Weapon";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator, Spinner } from "ts/Actors/Rotators";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";


export class LandingPad extends GameObject<IModel<LandingPadData>> {
    constructor(model: IModel<LandingPadData>) {
        var view: IView = new PolyView(model.data);
        super(model, [view]);
    }
}

export class PlanetSurface extends GameObject<IModel<IPlanetSurfaceData>> {
    constructor(location: Coordinate) {
        var model: IModel<IPlanetSurfaceData> = new DynamicModel<IPlanetSurfaceData>(new PlanetSurfaceData(location));
        var view: IView = new PolyView(model.data);
        super(model, [view]);
    }
}
