import { IShip } from "../../Objects/Ship/IShip";
import { IControls, IParticleField } from "../Asteroids/AsteroidModels";
import { ISurfaceGeneration, ISurface } from "./SurfaceGenerator";
import { IStateConfig } from "../../../gamelib/GameState/IStateConfig";
export interface ILandExplorer {
    title: string;
    stateConfig: IStateConfig;
    controls: IControls;
    ship: IShip;
    starField: IParticleField;
    surfaceGenerator: ISurfaceGeneration;
    surface: ISurface;
    surfaceImg: string;
}