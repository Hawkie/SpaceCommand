import { IShip, CreateShip } from "../../Components/Ship/ShipComponent";
import { ISurfaceGeneration, ISurface, initSurface } from "../../Actors/SurfaceGenerator";
import { ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
import { IParticleField, CreateField } from "../../Components/FieldComponent";
import { IAsteroidsControls } from "../Asteroids/Components/AsteroidsControlsComponent";

export interface ILandExplorerData {
    title: string;
    controls: IAsteroidsControls;
    ship: IShip;
    starField: IParticleField;
    surfaceGenerator: ISurfaceGeneration;
    surface: ISurface;
    surfaceImg: string;
}

export function createLandExplorerData(): ILandExplorerData {
    let ship: IShip = CreateShip(256, 240, 10);
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

    return {
        title: "Space Commander",
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

