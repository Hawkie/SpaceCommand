import { IShip } from "../../Objects/Ship/IShip";
import { IStateConfig } from "../../../gamelib/GameState/IStateConfig";
import { IControls, IParticleField, IBall, ICoin, IAsteroids, IGraphicShip } from "./AsteroidModels";
export interface IAsteroidModel {
    stateConfig: IStateConfig;
    controls: IControls;
    starField: IParticleField;
    ship: IShip;
    ball: IBall;
    coin: ICoin;
    level: number;
    asteroids: IAsteroids;
    graphicShip: IGraphicShip;
    score: number;
    title: string;
}