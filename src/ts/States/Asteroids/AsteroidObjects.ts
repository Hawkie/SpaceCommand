import { IBall, ICoin, IGraphicShip, IAsteroid, AsteroidModels, IParticleField } from "./AsteroidModels";
import { IAsteroidModel } from "./IAsteroidModel";
import { IView } from "ts/gamelib/Views/View";
import { PolyView, LineView } from "ts/gamelib/Views/PolyViews";
import { PolyGraphicAngled } from "ts/gamelib/Views/PolyGraphicAngled";
import { RectangleView } from "ts/gamelib/Views/RectangleView";
import { CircleView } from "ts/gamelib/Views/CircleView";
import { MoveConstVelocity, IMoveOut } from "ts/gamelib/Actors/Movers";
import { SingleGameObject, IGameObject, MultiGameObject } from "ts/gamelib/GameObjects/GameObject";
import { IActor } from "ts/gamelib/Actors/Actor";
import { SpriteAnimator } from "ts/gamelib/Actors/SpriteAnimator";
import { Spinner, PolyRotator } from "ts/gamelib/Actors/Rotators";
import { SpriteAngledView } from "ts/gamelib/Views/SpriteView";
import { GraphicAngledView } from "ts/gamelib/Views/GraphicView";
import { IShape } from "ts/gamelib/Data/Shape";
import { CompositeAccelerator, IRodOutputs, IRodInputs } from "ts/gamelib/Actors/Accelerators";
import { Coordinate } from "ts/gamelib/Data/Coordinate";
import { IParticle, AsteroidFields, createParticleField } from "./AsteroidFields";
import { AgePred, ParticleRemover, IParticleGenInputs } from "ts/gamelib/Actors/ParticleFieldUpdater";
import { ValueView } from "ts/gamelib/Views/ValueView";
import { TextView } from "ts/gamelib/Views/TextView";
import { ISoundInputs, Sound } from "ts/gamelib/Actors/Sound";
import { createWrapActor } from "ts/gamelib/Actors/Wrap";
import { Transforms } from "ts/gamelib/Physics/Transforms";
import { createShipObject, createWeaponObject, createExhaustObj, createExplosionObj } from "ts/States/Asteroids/Ship/ShipObjects";
import { IShip } from "./Ship/ShipState";
import { IStateConfig } from "ts/gamelib/States/StateConfig";

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

export function createAsteroidObject(getAsteroid: () => IAsteroid): SingleGameObject {
    var asteroid: IAsteroid = getAsteroid();
    var mover: IActor = new MoveConstVelocity(() => {
        return {
            Vx: asteroid.Vx,
            Vy: asteroid.Vy,
        };
    }, (out: IMoveOut) => {
        asteroid.x += out.dx;
        asteroid.y += out.dy;
    }
    );
    var spinner: IActor = new Spinner(() => {
        return { spin: asteroid.spin };
    }, (sOut) => asteroid.angle += sOut.dAngle);
    var rotator: IActor = new PolyRotator(() => {
        return {
            angle: asteroid.angle,
            shape: asteroid.shape,
        };
    }, (out: IShape) => {
        asteroid.shape = out;
    });
    var wrapx: IActor = createWrapActor(() => {
        return {
            value: asteroid.x,
            lowLimit: 0,
            upLimit: 512,
        };
    }, (a) => asteroid.x = a);
    var wrapy: IActor = createWrapActor(() => {
        return {
            value: asteroid.y,
            lowLimit: 0,
            upLimit: 480,
        };
    }, (a) => asteroid.y = a);

    var view: IView = new PolyGraphicAngled(() => {
        return {
            x: asteroid.x,
            y: asteroid.y,
            shape: asteroid.shape,
            graphic: asteroid.graphic,
            angle: asteroid.angle,
        };
    });
    var asteroidObject: SingleGameObject = new SingleGameObject([mover, spinner, rotator, wrapx, wrapy], [view]);
    return asteroidObject;
}


export function createBallObject(getBall: () => IBall): SingleGameObject {
    var ball: IBall = getBall();
    var ballView: IView = new CircleView(() => {
        return {
            x: ball.x,
            y: ball.y,
            r: ball.r,
        };
    });
    var obj: SingleGameObject = new SingleGameObject([], [ballView]);
    return obj;
}

export function createShipBallObject(getShip: () => IShip, getBall: () => IBall): SingleGameObject {
    var ship: IShip = getShip();
    var ball: IBall = getBall();
    var rod: CompositeAccelerator = new CompositeAccelerator(() => {
        return {
            xFrom: ship.x,
            yFrom: ship.y,
            VxFrom: ship.Vx,
            VyFrom: ship.Vy,
            forces: [ship.thrust],
            massFrom: ship.mass,
            xTo: ball.x,
            yTo: ball.y,
            VxTo: ball.Vx,
            VyTo: ball.Vy,
            massTo: ball.mass
        };
    }, (out: IRodOutputs) => {
        ship.x += out.dxFrom;
        ship.y += out.dyFrom;
        ship.Vx += out.dVxFrom;
        ship.Vy += out.dVyFrom;
        ball.x = out.xTo;
        ball.y = out.yTo;
    });

    // create rod view as a line from ball to ship
    var line: LineView = new LineView(() => {
        return {
            xFrom: ball.x,
            yFrom: ball.y,
            xTo: ship.x,
            yTo: ship.y,
        };
    });
    var r: SingleGameObject = new SingleGameObject([rod], [line]);
    return r;
}

export function createCoinObject(getCoin: () => ICoin): SingleGameObject {
    var coin: ICoin = getCoin();
    var animator: IActor = new SpriteAnimator(coin.sprite, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0.1]);
    var spinner: Spinner = new Spinner(() => {
        return { spin: coin.spin };
    }, (sOut) => coin.angle += sOut.dAngle);

    var view: IView = new SpriteAngledView(() => {
        return {
            x: coin.x,
            y: coin.y,
            angle: coin.angle,
            sprite: coin.sprite,
        };
    });
    var coinObj: SingleGameObject = new SingleGameObject([animator, spinner], [view]);
    return coinObj;
}

export function createGraphicShipObject(getGraphicShip: () => IGraphicShip): SingleGameObject {
    var graphicShip: IGraphicShip = getGraphicShip();
    var shipView: IView = new GraphicAngledView(() => {
        return {
            x: graphicShip.x,
            y: graphicShip.y,
            angle: graphicShip.angle,
            graphic: graphicShip.graphic,
        };
    });
    var obj: SingleGameObject = new SingleGameObject([], [shipView]);
    return obj;
}

