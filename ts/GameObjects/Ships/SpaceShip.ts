
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { TextView } from "ts/Views/TextView";
import { TextData } from "ts/Models/TextModel";
import { IParticleData, IParticleFieldData, ParticleData, ParticleFieldData, MovingParticleModel } from "ts/Models/ParticleFieldModel";
import { ISpaceShipData, BasicShipData } from "ts/Data/ShipData";
import { ShapeData } from "ts/Data/ShapeData";
import { BasicShipModel } from "ts/Models/Ships/SpaceShipModel";
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

 

export class BasicShip extends GameObject<BasicShipModel> {
    

    constructor(location: Coordinate, velx: number, vely: number, angle: number, spin: number) {
        
        var shipModel: BasicShipModel = new BasicShipModel(new BasicShipData(location, velx, vely, angle, spin));
        var shipView: IView = new PolyView(shipModel.data, shipModel.shape);

        var weaponView: IView = new ParticleFieldView(shipModel.weaponModel, 1, 1);
        var thrustView: ParticleFieldView = new ParticleFieldView(shipModel.thrustParticleModel.data, 1, 1);
        var explosionView: ParticleFieldView = new ParticleFieldView(shipModel.explosionParticleModel.data, 3, 3);

        var views: IView[] = [shipView, weaponView, thrustView, explosionView];
        super(shipModel, views);
    }
}