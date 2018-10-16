import { ILandExplorer } from "./ILandExplorer";
import { IGameObject } from "../../../gamelib/GameObjects/IGameObject";
import { MultiGameObject } from "ts/gamelib/GameObjects/MultiGameObject";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
import { createShipObject, createShipAccelerator } from "../../Objects/Ship/ShipObjects";
import { createExplosionObj } from "../../Objects/Ship/createExplosionObj";
import { createExhaustObj } from "../../Objects/Ship/createExhaustObj";
import { createWeaponObject } from "../../Objects/Ship/createWeaponObject";
import { IView } from "../../../gamelib/Views/View";
import { createBackgroundField } from "../../Objects/Particle/createBackgroundField";
import { TextView } from "../../../gamelib/Views/TextView";
import { Coordinate, ICoordinate } from "../../../gamelib/Data/Coordinate";
import { PolyGraphic } from "../../../gamelib/Views/PolyGraphic";
import { Graphic, IGraphic } from "../../../gamelib/Data/Graphic";
import { ISurface, SurfaceGenerator2, ISurfaceGeneration } from "./SurfaceGenerator";
import { IAcceleratorInputs } from "../../../gamelib/Actors/Accelerator";
import { IActor } from "../../../gamelib/Actors/Actor";

export interface ILandExplorerObjects {
    shipObj: SingleGameObject;
    weaponObj: MultiGameObject<SingleGameObject>;
    exhaustObj: MultiGameObject<SingleGameObject>;
    explosionObj: MultiGameObject<SingleGameObject>;
    // wind: SingleGameObject;
    surfaceObj: SingleGameObject;
    // landingPad: SingleGameObject;
    // ballObject: SingleGameObject;
    views: IView[];
    sceneObjs: IGameObject[];
}

export function createLandExplorerObjects(getState: () => ILandExplorer): ILandExplorerObjects {
    var state: ILandExplorer = getState();
    var shipObj: SingleGameObject = createShipObject(() => state.stateConfig, () => state.controls, () => state.ship);
    var shipThrust: SingleGameObject = createShipAccelerator(() => state.ship);
    var weaponObj: MultiGameObject<SingleGameObject> = createWeaponObject(
        () => state.controls,
        () => state.ship,
        () => state.ship.weapon1);
    var exhaustObj: MultiGameObject<SingleGameObject> = createExhaustObj(() => state.ship);
    var explosionObj: MultiGameObject<SingleGameObject> = createExplosionObj(() => state.ship);

    var surfaceObj: SingleGameObject = createPlanetSurfaceObject(() => {
        return {
            x: state.ship.x,
            y: state.ship.y,
        };
    },
        () => state.surfaceGenerator,
        () => state.surface,
        state.surfaceImg);

    var starFieldObj: MultiGameObject<SingleGameObject> = createBackgroundField(() => state.starField, 32);

    // ship = space ship controller with gravity
    var title: IView = new TextView(() => state.title, new Coordinate(10, 20), "Arial", 18);

    return {
        shipObj: shipObj,
        weaponObj: weaponObj,
        exhaustObj: exhaustObj,
        explosionObj: explosionObj,
        surfaceObj: surfaceObj,
        views: [title],
        sceneObjs: [shipObj, shipThrust, weaponObj, exhaustObj, explosionObj, surfaceObj],
    };
}

export function createPlanetSurfaceObject(getFrom: () => ICoordinate,
    getSurfaceGenerator: () => ISurfaceGeneration,
    getSurface: () => ISurface, texture: string): SingleGameObject {
    var from: ICoordinate = getFrom();
    var surface: ISurface = getSurface();
    var surfaceExtender: IActor = new SurfaceGenerator2(getFrom, getSurfaceGenerator, getSurface);
    var surfaceView: IView = new PolyGraphic(() => {
        return {
            x: from.x,
            y: from.y,
            shape: {
                offset: { x: 0, y: 0 },
                points: surface.points,
            },
            graphic: texture,
        };
    });
    var obj: SingleGameObject = new SingleGameObject([surfaceExtender], [surfaceView]);
    return obj;
}
