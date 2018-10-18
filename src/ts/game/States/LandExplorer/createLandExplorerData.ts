import { IShip, createShip } from "../../Objects/Ship/IShip";
import { IParticleField, createStarFieldData, IControls } from "../Asteroids/createAsteroidData";
import { ISurfaceGeneration, ISurface, initSurface } from "../../Actors/SurfaceGenerator";
import { ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
import { IGameStateConfig } from "../../../gamelib/GameState/IGameStateConfig";

export interface ILandExplorerData {
    title: string;
    stateConfig: IGameStateConfig;
    controls: IControls;
    ship: IShip;
    starField: IParticleField;
    surfaceGenerator: ISurfaceGeneration;
    surface: ISurface;
    surfaceImg: string;
}

export function createLandExplorerData(): ILandExplorerData {
    let ship: IShip = createShip(256, 240, 10);
    let surfaceGenerator: ISurfaceGeneration = {
        resolution: 5,
        upper: 5,
        lower: -5,
    };
    let points: ICoordinate[] = initSurface(520, ()=>surfaceGenerator);
    let surface: ISurface = {
        addedLeft: 0,
        points: points,
    };

    let stateConfig: IGameStateConfig = {
        screenWrap: false,
        gravity: true,
    };

    let starField: IParticleField = createStarFieldData();
    return {
        title: "Space Commander",
        stateConfig: stateConfig,
        controls: {
            left: false,
            right: false,
            up: false,
            fire: false,
        },
        ship: ship,
        starField: starField,
        surfaceGenerator: surfaceGenerator,
        surface: surface,
        surfaceImg: "res/img/terrain.png",
    };
}

