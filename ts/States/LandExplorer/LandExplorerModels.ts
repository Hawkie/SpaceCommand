import { IShip, createShip } from "ts/States/Asteroids/Ship/ShipState";
import { IControls, IParticleField, createStarField } from "../Asteroids/AsteroidModels";
import { IShape, Shape } from "ts/gamelib/Data/Shape";
import { ISurfaceGeneration, ISurface, initSurface } from "./SurfaceGenerator";
import { ICoordinate } from "../../gamelib/Data/Coordinate";

export interface ILandExplorer {
    title: string;
    controls: IControls;
    ship: IShip;
    starField: IParticleField;
    surfaceGenerator: ISurfaceGeneration;
    surface: ISurface;
    surfaceImg: string;
}

export function createModel(): ILandExplorer {
    var ship: IShip = createShip(256, 240, 10);
    var surfaceGenerator: ISurfaceGeneration = {
        resolution: 5,
        upper: 5,
        lower: -5,
    };
    var points: ICoordinate[] = initSurface(520, ()=>surfaceGenerator);
    var surface: ISurface = {
        addedLeft: 0,
        points: points,
    };

    var starField: IParticleField = createStarField();
    return {
        title: "Space Commander",
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

