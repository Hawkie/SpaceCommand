import { IShip } from "ts/States/Asteroids/Ship/ShipState";
import { IStateConfig } from "ts/gamelib/GameState/StateConfig";
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