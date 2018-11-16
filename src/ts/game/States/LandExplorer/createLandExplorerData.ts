import { IShip, createShip } from "../../Objects/Ship/ShipComponent";
import { ISurfaceGeneration, ISurface, initSurface } from "../../Actors/SurfaceGenerator";
import { ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
import { IGameStateConfig } from "../../../gamelib/GameState/IGameStateConfig";
import { IParticleField, CreateField } from "../../Components/FieldComponent";
import { IAsteroidsControls } from "../Asteroids/AsteroidsControlsComponent";

export interface ILandExplorerData {
    title: string;
    stateConfig: IGameStateConfig;
    controls: IAsteroidsControls;
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

    return {
        title: "Space Commander",
        stateConfig: stateConfig,
        controls: {
            left: false,
            right: false,
            up: false,
            fire: false,
            zoomIn: false,
            zoomOut: false,
            exit: false,
        },
        ship: ship,
        starField: CreateField(true, 1, 1),
        surfaceGenerator: surfaceGenerator,
        surface: surface,
        surfaceImg: "res/img/terrain.png",
    };
}

