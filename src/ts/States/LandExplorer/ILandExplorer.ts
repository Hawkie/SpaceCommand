import { IShip } from "ts/States/Asteroids/Ship/ShipState";
import { IControls, IParticleField } from "../Asteroids/AsteroidModels";
import { ISurfaceGeneration, ISurface } from "./SurfaceGenerator";
import { IStateConfig } from "../../gamelib/States/StateConfig";
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