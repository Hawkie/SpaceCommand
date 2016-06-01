import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { TextObject } from "ts/GameObjects/Common/BaseObjects";
import { IShape, ShapeData } from "../Data/ShapeData";
import { ILocated, LocatedData } from "../Data/PhysicsData";
import { DynamicModel, ShapedModel } from "ts/Models/DynamicModels";
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { TextView } from "ts/Views/TextView";
import { TextData } from "ts/Models/TextModel";
import { PlanetSurfaceModel } from "ts/Models/Land/PlanetSurface";
import { IWeaponData, WeaponData } from "ts/Models/Weapons/Weapon";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator, Spinner } from "ts/Actors/Rotators";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";


export class PlanetSurface extends GameObject<PlanetSurfaceModel> {
    constructor(location: Coordinate) {
        var model = new PlanetSurfaceModel(location);
        var surface: IView = new PolyView(model.data, model.shape);
        var pad: IView = new PolyView(model.landingPad.data, model.landingPad.shape)
        super(model, [surface, pad]);
    }
}
