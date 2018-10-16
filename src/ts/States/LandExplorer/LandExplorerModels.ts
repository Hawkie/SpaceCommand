import { IShip, createShip } from "ts/States/Asteroids/Ship/ShipState";
import { IParticleField, createStarField } from "../Asteroids/AsteroidModels";
import { IShape, Shape } from "ts/gamelib/Data/Shape";
import { ISurfaceGeneration, ISurface, initSurface } from "./SurfaceGenerator";
import { ICoordinate } from "../../gamelib/Data/Coordinate";
import { ILandExplorer } from "./ILandExplorer";
import { IStateConfig } from "ts/gamelib/GameState/StateConfig";

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

    var stateConfig: IStateConfig = {
        screenWrap: false,
        gravity: true,
    };

    var starField: IParticleField = createStarField();
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

