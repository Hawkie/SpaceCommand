import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { TextObject } from "ts/GameObjects/Common/BaseObjects";
import { IModel, DynamicModel } from "ts/Models/DynamicModels";
import { IShapeLocated, IShapeLocatedMoving, IShapeLocatedAngledMovingRotataing, IShapeLocatedAngledMovingRotataingAccelerating } from "../Models/PolyModels";
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { TextView } from "ts/Views/TextView";
import { TextData } from "ts/Models/TextModel";
import { IShipData } from "ts/Models/Ships/Ship";
import { LandingBasicShipData, LandingShipModel } from "ts/Models/Ships/LandingShip";
import { Coordinate, Vector } from "ts/Physics/Common";


export class LandingBasicShip extends GameObject<LandingShipModel> {


    constructor(location: Coordinate) {

        let triangleShip = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];
        var shipModel: LandingShipModel = new LandingShipModel(new LandingBasicShipData(triangleShip, location));
        var shipView: IView = new PolyView(shipModel.data);

        var thrustView: ParticleFieldView = new ParticleFieldView(shipModel.thrustParticles1, 1, 1);
        var explosionView: ParticleFieldView = new ParticleFieldView(shipModel.explosionParticles1, 3, 3);

        super(shipModel, [shipView, thrustView, explosionView]);

    }

    
}