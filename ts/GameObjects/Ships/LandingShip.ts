import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { TextObject } from "ts/GameObjects/Common/BaseObjects";
import { DynamicModel } from "ts/Models/DynamicModels";
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { TextView } from "ts/Views/TextView";
import { TextData } from "ts/Models/TextModel";
import { IShipData, LandingBasicShipData } from "ts/Data/ShipData";
import { LandingShipModel } from "ts/Models/Ships/LandingShip";
import { Coordinate, Vector } from "ts/Physics/Common";


export class LandingBasicShip extends GameObject<LandingShipModel> {

    constructor(location: Coordinate) {
        var shipModel: LandingShipModel = new LandingShipModel(new LandingBasicShipData(location));
        var shipView: IView = new PolyView(shipModel.data, shipModel.shape);

        var thrustView: ParticleFieldView = new ParticleFieldView(shipModel.thrustParticleModel.data, 1, 1);
        var explosionView: ParticleFieldView = new ParticleFieldView(shipModel.explosionParticleModel.data, 3, 3);

        super(shipModel, [shipView, thrustView, explosionView]);
    }

    
}