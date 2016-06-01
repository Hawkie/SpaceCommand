import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { TextObject } from "ts/GameObjects/Common/BaseObjects";
import { DynamicModel, DisplayModel } from "ts/Models/DynamicModels";
import { ILocatedAngledMovingRotatingForwardAcc, LocatedMovingAngledRotatingForwardAccData } from "ts/Data/PhysicsData";
import { GraphicData } from "ts/Data/GraphicData";
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { GraphicAngledView } from "ts/Views/GraphicView";
import { TextView } from "ts/Views/TextView";
import { TextData } from "ts/Models/TextModel";
//import { IShipData } from "ts/Models/Ships/Ship";
//import { LandingBasicShipData, LandingShipModel } from "ts/Models/Ships/LandingShip";
import { Coordinate, Vector } from "ts/Physics/Common";


export class GraphicShip extends GameObject<DisplayModel<LocatedMovingAngledRotatingForwardAccData>> {

    constructor(location: Coordinate) {

        //let triangleShip = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];
        var shipModel: DisplayModel<LocatedMovingAngledRotatingForwardAccData> = new DisplayModel<LocatedMovingAngledRotatingForwardAccData>(new LocatedMovingAngledRotatingForwardAccData(location, 1, -1, 10, 5, 0), new GraphicData("res/img/ship.png"));
        var shipView: IView = new GraphicAngledView(shipModel.data, shipModel.graphic);

        //var thrustView: ParticleFieldView = new ParticleFieldView(shipModel.thrustParticleModel.data, 1, 1);
        //var explosionView: ParticleFieldView = new ParticleFieldView(shipModel.explosionParticleModel.data, 3, 3);

        super(shipModel, [shipView]);
    }
}