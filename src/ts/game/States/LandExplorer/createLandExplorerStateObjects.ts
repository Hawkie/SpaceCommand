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
import { ISurface, SurfaceGenerator2, ISurfaceGeneration } from "../../Actors/SurfaceGenerator";
import { IAcceleratorInputs } from "../../../gamelib/Actors/Accelerator";
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
}

export function createLandExplorerStateObjects(getData: () => ILandExplorerData): ILandExplorerStateObjects {
    var data: ILandExplorerData = getData();
    var shipObj: SingleGameObject = createShipObject(() => data.stateConfig, () => data.controls, () => data.ship);
    var shipThrust: SingleGameObject = createShipAccelerator(() => data.ship);
    var weaponObj: MultiGameObject<SingleGameObject> = createWeaponObject(
        () => data.controls,
        () => data.ship,
        () => data.ship.weapon1);
    var exhaustObj: MultiGameObject<SingleGameObject> = createExhaustObj(() => data.ship);
    var explosionObj: MultiGameObject<SingleGameObject> = createExplosionObj(() => data.ship);

    var surfaceObj: SingleGameObject = createPlanetSurfaceObject(() => {
        return {
            x: data.ship.x,
            y: data.ship.y,
        };
    },
        () => data.surfaceGenerator,
        () => data.surface,
        data.surfaceImg);

    var starFieldObj: MultiGameObject<SingleGameObject> = createBackgroundField(() => data.starField, 32);

    // ship = space ship controller with gravity
    var title: IView = new TextView(() => data.title, new Coordinate(10, 20), "Arial", 18);

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
