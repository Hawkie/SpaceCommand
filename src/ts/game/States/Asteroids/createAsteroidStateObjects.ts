import { IAsteroidsState } from "./AsteroidState";
import { IView } from "../../../gamelib/Views/View";
import { IGameObject } from "../../../gamelib/GameObjects/IGameObject";
import { MultiGameObject } from "../../../gamelib/GameObjects/MultiGameObject";
import { SingleGameObject } from "../../../gamelib/GameObjects/SingleGameObject";
import { IActor } from "../../../gamelib/Actors/Actor";
import { Coordinate } from "../../../gamelib/DataTypes/Coordinate";
import { ValueView } from "../../../gamelib/Views/ValueView";
import { TextView } from "../../../gamelib/Views/TextView";
// import { ISoundInputs, Sound } from "../../../../../src/ts/gamelib/Actors/Sound";
import { createShipObject } from "../../../../../src/ts/game/Objects/Ship/ShipObjects";
import { createExplosionObj } from "../../../../../src/ts/game/Objects/Ship/createExplosionObj";
import { createExhaustObj } from "../../../../../src/ts/game/Objects/Ship/createExhaustObj";
import { createWeaponObject } from "../../../../../src/ts/game/Objects/Ship/createWeaponObject";
import { createCoinObject } from "../../Objects/Asteroids/createCoinObject";
import { createGraphicShipObject } from "../../Objects/Asteroids/createGraphicShipObject";
import { createShipBallObject } from "../../Objects/Asteroids/createShipBallObject";
import { createBackgroundField } from "../../Objects/Particle/createBackgroundField";
import { IAsteroid } from "../../Components/AsteroidComponent";
import { createBallObject } from "../../Objects/Asteroids/createBallObject";

// list all objects that don't manage themselves separately
export interface IAsteroidStateObject {
    // shipObj: SingleGameObject;
    weaponObj: MultiGameObject<SingleGameObject>;
    // asteroidObjs: MultiGameObject<SingleGameObject>;
    views: IView[];
    sceneObjs: IGameObject[];
}

export function createAsteroidStateObject(getData: () => IAsteroidsState): IAsteroidStateObject {
    let data: IAsteroidsState = getData();

    // let starFieldObj: MultiGameObject<SingleGameObject> = createBackgroundField(() => data.starField, 32);
    // let shipObj: SingleGameObject = createShipObject(() => data.stateConfig, ()=> data.controls, () => data.ship);
    let weaponObj: MultiGameObject<SingleGameObject> = createWeaponObject(()=>data.controls,
    ()=> data.ship, () => data.ship.weapon1);
    // let exhaustObj: MultiGameObject<SingleGameObject> = createExhaustObj(() => data.ship);
    // let explosionObj: MultiGameObject<SingleGameObject> = createExplosionObj(() => data.ship);
    let ballObj: SingleGameObject = createBallObject(() => data.ball);
    let shipBallObj: SingleGameObject = createShipBallObject(() => data.ship, () => data.ball);
    let coinObj: SingleGameObject = createCoinObject(() => data.coin);
    let gShipObj: SingleGameObject = createGraphicShipObject(() => data.graphicShip);
    // let asteroidObjs: MultiGameObject<SingleGameObject> = createAsteroidObjs(() => data.asteroids.asteroids);
    // let breakSound: IActor = new Sound(data.asteroids.breakSoundFilename, true, false, () => {
    //     return {
    //         play: data.asteroids.playBreakSound,
    //     };
    // },
    //     () => data.asteroids.playBreakSound = false);
    // asteroidObjs.actors.push(breakSound);

    let title: IView = new TextView(() => data.title, new Coordinate(10, 20), "Arial", 18);
    let score: IView = new TextView(() => "Score:", new Coordinate(400, 20), "Arial", 18);
    let scoreDisplay: IView = new ValueView(() => data.score, new Coordinate(460, 20), "Arial", 18);
    let angleDisplay: IView = new ValueView(() => data.ship.angle, new Coordinate(460, 40), "Arial", 18);

    let aObjs: IAsteroidStateObject = {
        // shipObj: shipObj,
        weaponObj: weaponObj,
        // asteroidObjs: asteroidObjs,
        views: [title, score, scoreDisplay, angleDisplay],
        sceneObjs: [weaponObj, shipBallObj,
            coinObj, ballObj, gShipObj],
    };
    return aObjs;
}

// export function createAsteroidObjs(getAsteroids: () => IAsteroid[]):
//  a   MultiGameObject<SingleGameObject> {
//     let asteroidArray: SingleGameObject[] = [];
//     let asteroidObjs: MultiGameObject<SingleGameObject> =
//         new MultiGameObject<SingleGameObject>([], [], () => asteroidArray);
//     getAsteroids().forEach(a => {
//         asteroidObjs.getComponents().push(createAsteroidObject(() => a));
//     });
//     return asteroidObjs;
// }


