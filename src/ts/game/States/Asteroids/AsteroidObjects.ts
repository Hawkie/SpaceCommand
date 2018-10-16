import { IAsteroid, AsteroidModels, IParticleField } from "./AsteroidModels";
import { IAsteroidModel } from "./IAsteroidModel";
import { IView } from "ts/gamelib/Views/View";
import { IGameObject } from "../../../gamelib/GameObjects/IGameObject";
import { MultiGameObject } from "ts/gamelib/GameObjects/MultiGameObject";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
import { IActor } from "ts/gamelib/Actors/Actor";
import { Coordinate } from "ts/gamelib/Data/Coordinate";
import { createParticleField } from "../../Objects/Asteroids/createParticleField";
import { ValueView } from "ts/gamelib/Views/ValueView";
import { TextView } from "ts/gamelib/Views/TextView";
import { ISoundInputs, Sound } from "ts/gamelib/Actors/Sound";
import { Transforms } from "ts/gamelib/Physics/Transforms";
import { createShipObject } from "ts/game/Objects/Ship/ShipObjects";
import { createExplosionObj } from "ts/game/Objects/Ship/createExplosionObj";
import { createExhaustObj } from "ts/game/Objects/Ship/createExhaustObj";
import { createWeaponObject } from "ts/game/Objects/Ship/createWeaponObject";
import { createCoinObject } from "../../Objects/Asteroids/createCoinObject";
import { createGraphicShipObject } from "../../Objects/Asteroids/createGraphicShipObject";
import { createAsteroidObject } from "../../Objects/Asteroids/createAsteroidObject";
import { createBallObject } from "../../Objects/Asteroids/createBallObject";
import { createShipBallObject } from "../../Objects/Asteroids/createShipBallObject";

// list all objects that don't manage themselves separately
export interface IAsteroidStateObject {
    shipObj: SingleGameObject;
    weaponObj: MultiGameObject<SingleGameObject>;
    asteroidObjs: MultiGameObject<SingleGameObject>;
    views: IView[];
    sceneObjs: IGameObject[];
}

export function createAsteroidStateObject(getState: () => IAsteroidModel): IAsteroidStateObject {
    var state: IAsteroidModel = getState();
    var starFieldObj: MultiGameObject<SingleGameObject> = createBackgroundField(() => state.starField, 32);
    var shipObj: SingleGameObject = createShipObject(() => state.stateConfig, ()=> state.controls, () => state.ship);
    var weaponObj: MultiGameObject<SingleGameObject> = createWeaponObject(()=>state.controls,
    ()=> state.ship, () => state.ship.weapon1);
    var exhaustObj: MultiGameObject<SingleGameObject> = createExhaustObj(() => state.ship);
    var explosionObj: MultiGameObject<SingleGameObject> = createExplosionObj(() => state.ship);

    var ballObj: SingleGameObject = createBallObject(() => state.ball);
    var shipBallObj: SingleGameObject = createShipBallObject(() => state.ship, () => state.ball);
    var coinObj: SingleGameObject = createCoinObject(() => state.coin);
    var gShipObj: SingleGameObject = createGraphicShipObject(() => state.graphicShip);
    var asteroidObjs: MultiGameObject<SingleGameObject> = createAsteroidObjs(() => state.asteroids.asteroids);
    var breakSound: IActor = new Sound(state.asteroids.breakSoundFilename, true, false, () => {
        return {
            play: state.asteroids.playBreakSound,
        };
    },
        () => state.asteroids.playBreakSound = false);
    asteroidObjs.actors.push(breakSound);

    var title: IView = new TextView(() => state.title, new Coordinate(10, 20), "Arial", 18);
    var score: IView = new TextView(() => "Score:", new Coordinate(400, 20), "Arial", 18);
    var scoreDisplay: IView = new ValueView(() => state.score, new Coordinate(460, 20), "Arial", 18);
    var angleDisplay: IView = new ValueView(() => state.ship.angle, new Coordinate(460, 40), "Arial", 18);

    var aObjs: IAsteroidStateObject = {
        shipObj: shipObj,
        weaponObj: weaponObj,
        asteroidObjs: asteroidObjs,
        views: [title, score, scoreDisplay, angleDisplay],
        sceneObjs: [starFieldObj, shipObj, weaponObj, exhaustObj, explosionObj, shipBallObj,
            coinObj, ballObj, gShipObj],
    };
    return aObjs;
}

export function createAsteroidObjs(getAsteroids: () => IAsteroid[]):
    MultiGameObject<SingleGameObject> {
    var asteroidArray: SingleGameObject[] = [];
    var asteroidObjs: MultiGameObject<SingleGameObject> =
        new MultiGameObject<SingleGameObject>([], [], () => asteroidArray);
    getAsteroids().forEach(a => {
        asteroidObjs.getComponents().push(createAsteroidObject(() => a));
    });
    return asteroidObjs;
}

// todo add the edge predicate to background
//     var edge1:PredGreaterThan<IParticle> = new PredGreaterThan(()=>700, (p: IParticle)=> p.y);
export function createBackgroundField(getField: () => IParticleField, speed: number): MultiGameObject<SingleGameObject> {
    var field: IParticleField = getField();
    var starField: MultiGameObject<SingleGameObject> = createParticleField(field,
        () => {
            return {
                on: field.on,
                x: 0,
                xOffset: 0,
                xLowSpread: 0,
                xHighSpread: 512,
                y: 0,
                yOffset: 0,
                yLowSpread: 0,
                yHighSpread: 0,
                Vx: 0,
                vXLowSpread: 0,
                vXHighSpread: 0,
                Vy: speed,
                vYLowSpread: 0,
                vYHighSpread: 10,
            };
        });
    return starField;
}


