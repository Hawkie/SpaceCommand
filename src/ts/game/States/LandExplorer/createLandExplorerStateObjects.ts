import { IGameObject } from "../../../gamelib/GameObjects/IGameObject";
import { MultiGameObject } from "../../../gamelib/GameObjects/MultiGameObject";
import { SingleGameObject } from "../../../gamelib/GameObjects/SingleGameObject";
import { createShipObject, createShipAccelerator } from "../../Objects/Ship/ShipObjects";
import { createExplosionObj } from "../../Objects/Ship/createExplosionObj";
import { createExhaustObj } from "../../Objects/Ship/createExhaustObj";
import { createWeaponObject } from "../../Objects/Ship/createWeaponObject";
import { IView } from "../../../gamelib/Views/View";
import { createBackgroundField } from "../../Objects/Particle/createBackgroundField";
import { TextView } from "../../../gamelib/Views/TextView";
import { Coordinate, ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
import { PolyGraphic } from "../../../gamelib/Views/PolyGraphic";
import { ISurface, SurfaceGenerator2, ISurfaceGeneration } from "../../Actors/SurfaceGenerator";
import { IActor } from "../../../gamelib/Actors/Actor";
import { ILandExplorerData } from "./createLandExplorerData";

export interface ILandExplorerStateObjects {
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
    backgroundObjs: IGameObject[];
}

export function createLandExplorerStateObjects(getData: () => ILandExplorerData): ILandExplorerStateObjects {
    let data: ILandExplorerData = getData();
    let shipObj: SingleGameObject = createShipObject(() => data.stateConfig,
        () => data.controls, () => data.ship);
    let shipThrust: SingleGameObject = createShipAccelerator(() => data.ship);
    let weaponObj: MultiGameObject<SingleGameObject> = createWeaponObject(
        () => data.controls,
        () => data.ship,
        () => data.ship.weapon1);
    let exhaustObj: MultiGameObject<SingleGameObject> = createExhaustObj(() => data.ship);
    let explosionObj: MultiGameObject<SingleGameObject> = createExplosionObj(() => data.ship);

    // background objects
    let surfaceObj: SingleGameObject = createPlanetSurfaceObject(() => {
            return {
                x: data.ship.x,
                y: data.ship.y,
            };
        },
        () => data.surfaceGenerator,
        () => data.surface,
        data.surfaceImg);

    let starFieldObj: MultiGameObject<SingleGameObject> = createBackgroundField(() => data.starField, 32);

    // ship = space ship controller with gravity
    let title: IView = new TextView(() => data.title, new Coordinate(10, 20), "Arial", 18);

    return {
        shipObj: shipObj,
        weaponObj: weaponObj,
        exhaustObj: exhaustObj,
        explosionObj: explosionObj,
        surfaceObj: surfaceObj,
        views: [title],
        sceneObjs: [shipObj, shipThrust, weaponObj, exhaustObj, explosionObj],
        backgroundObjs: [surfaceObj, starFieldObj],
    };
}

export function createPlanetSurfaceObject(getFrom: () => ICoordinate,
    getSurfaceGenerator: () => ISurfaceGeneration,
    getSurface: () => ISurface, texture: string): SingleGameObject {
    let from: ICoordinate = getFrom();
    let surface: ISurface = getSurface();
    let surfaceExtender: IActor = new SurfaceGenerator2(getFrom, getSurfaceGenerator, getSurface);
    let surfaceView: IView = new PolyGraphic(() => {
        return {
            x: 0,
            y: 0,
            shape: {
                offset: { x: 0, y: 0 },
                points: surface.points,
            },
            graphic: texture,
        };
    });
    let obj: SingleGameObject = new SingleGameObject([surfaceExtender], [surfaceView]);
    return obj;
}
