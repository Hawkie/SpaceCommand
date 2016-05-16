import { IShapeLocated, IShapeLocatedMoving, IShapeLocatedAngledMovingRotataing, IShapeLocatedAngledMovingRotataingAccelerating } from "ts/Models/PolyModels";
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { TextView } from "ts/Views/TextView";
import { TextData } from "ts/Models/TextModel";
import { IParticleData, IParticleFieldData, ParticleData, ParticleFieldData, MovingParticleModel } from "ts/Models/ParticleFieldModel";
import { ISpaceShipData, IFiringShipModel } from "ts/Models/Ships/Ship";
import { BasicShipData, BasicShipModel } from "ts/Models/Ships/SpaceShipModel";
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

 
// todo: break down into single objects and composite objects
// single objects have simpler constructor
// composite objects

export class BasicShip extends GameObject<BasicShipModel> {
    

    constructor(location: Coordinate, velx: number, vely: number, angle: number, spin: number) {
        var triangleShip = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];

        //data object
        var shipModel: BasicShipModel = new BasicShipModel(new BasicShipData(triangleShip, location, velx, vely, angle, spin));
        var shipView: IView = new PolyView(shipModel.data);

        var weaponView: IView = new ParticleFieldView(shipModel.weaponModel, 1, 1);
        var thrustView: ParticleFieldView = new ParticleFieldView(shipModel.thrustParticles1, 1, 1);
        var explosionView: ParticleFieldView = new ParticleFieldView(shipModel.explosionParticles1, 3, 3);

        var views: IView[] = [shipView, weaponView, thrustView, explosionView];
        super(shipModel, views);
    }
}