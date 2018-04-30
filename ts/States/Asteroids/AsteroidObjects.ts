import { IAsteroidState, IBall, ICoin, IGraphicShip, IAsteroid, IShip,
    IWeapon, IExhaust, IExplosion, AsteroidModels } from "./AsteroidModels";
import { IView } from "ts/gamelib/Views/View";
import { CircleView, PolyGraphicAngled, PolyView, LineView, RectangleView } from "ts/gamelib/Views/PolyViews";
import { MoveConstVelocity, IMoveOut } from "ts/gamelib/Actors/Movers";
import { SingleGameObject, IGameObject, MultiGameObject } from "../../GameObjects/GameObject";
import { IActor } from "ts/gamelib/Actors/Actor";
import { SpriteAnimator } from "ts/gamelib/Actors/SpriteAnimator";
import { Spinner, PolyRotator } from "ts/gamelib/Actors/Rotators";
import { SpriteAngledView } from "ts/gamelib/Views/SpriteView";
import { GraphicAngledView } from "ts/gamelib/Views/GraphicView";
import { IShape } from "ts/gamelib/Data/Shape";
import { AsteroidActors } from "./AsteroidActors";
import { CompositeAccelerator, IRodOutputs, IRodInputs } from "ts/gamelib/Actors/Accelerators";
import { Coordinate } from "ts/gamelib/Data/Coordinate";
import { IParticle, Field } from "./ParticleField";
import { AgePred, ParticleRemover, IParticleGenInputs } from "ts/gamelib/Actors/ParticleFieldUpdater";
import { DrawContext } from "../../Common/DrawContext";
import { ValueView } from "ts/gamelib/Views/ValueView";
import { TextView } from "ts/gamelib/Views/TextView";
import { ISoundInputs, Sound } from "ts/gamelib/Actors/Sound";
import { ScreenFlashView } from "ts/gamelib/Views/EffectViews";
import { Flasher } from "ts/gamelib/Actors/Switches";
import { createWrapActor } from "ts/gamelib/Actors/Wrap";

// list all objects that don't manage themselves separately
export interface IAsteroidStateObject {
    shipObj: SingleGameObject<IShip>;
    weaponObj: MultiGameObject<SingleGameObject<IParticle>>;
    asteroidObjs: MultiGameObject<SingleGameObject<IAsteroid>>;
    views: IView[];
    sceneObjs: IGameObject[];
}


export function createAsteroidStateObject(getState: ()=>IAsteroidState): IAsteroidStateObject {
    var state: IAsteroidState = getState();
    var shipObj: SingleGameObject<IShip> = AsteroidObjects.createShipObject(getState, ()=>state.ship);

    var weaponObj: MultiGameObject<SingleGameObject<IParticle>>
        = AsteroidObjects.createWeaponObject(getState, ()=>state.ship.weapon1);
    var exhaustObj: MultiGameObject<SingleGameObject<IParticle>>
        = AsteroidObjects.createExhaustObj(()=>state.ship.exhaust, ()=>state.ship);
    var explosionObj: MultiGameObject<SingleGameObject<IParticle>>
        = AsteroidObjects.createExplosionObj(()=>state.ship.explosion, ()=>state.ship);

    var ballObj: SingleGameObject<IBall> = AsteroidObjects.createBallObject(()=>state.ball);
    var shipBallObj: SingleGameObject<IRodInputs> = AsteroidObjects.createShipBallObject(()=>state.ship, ()=>state.ball);
    var coinObj: SingleGameObject<ICoin> = AsteroidObjects.createCoinObject(()=>state.coin);
    var gShipObj: SingleGameObject<IGraphicShip> = AsteroidObjects.createGraphicShipObject(()=>state.graphicShip);
    var asteroidObjs: MultiGameObject<SingleGameObject<IAsteroid>> =  createAsteroidObjs(()=>state.asteroids.asteroids);
    var breakSound:IActor = new Sound(state.asteroids.breakSoundFilename, true, false, () => { return {
        play: state.asteroids.playBreakSound,
        };},
        ()=> state.asteroids.playBreakSound = false);
    asteroidObjs.actors.push(breakSound);

    var title: IView = new TextView(()=>state.title, new Coordinate(10, 20), "Arial", 18);
    var score: IView = new TextView(()=>"Score:", new Coordinate(400, 20), "Arial", 18);
    var scoreDisplay: IView = new ValueView(()=>state.score, new Coordinate(460, 20), "Arial", 18);
    var angleDisplay: IView = new ValueView(()=>state.ship.angle, new Coordinate(460, 40), "Arial", 18);

    var aObjs: IAsteroidStateObject = {
        shipObj: shipObj,
        weaponObj: weaponObj,
        asteroidObjs: asteroidObjs,
        views: [title, score, scoreDisplay, angleDisplay],
        sceneObjs: [shipObj,weaponObj, exhaustObj, explosionObj, shipBallObj,
            coinObj, ballObj, gShipObj],
    };
    return aObjs;
}

export function createAsteroidObjs(getAsteroids: ()=> IAsteroid[]):
        MultiGameObject<SingleGameObject<IAsteroid>> {
    var asteroidArray: SingleGameObject<IAsteroid>[] = [];
    var asteroidObjs: MultiGameObject<SingleGameObject<IAsteroid>> =
        new MultiGameObject<SingleGameObject<IAsteroid>>([], [], ()=>asteroidArray);
    getAsteroids().forEach(a => {
        asteroidObjs.getComponents().push(AsteroidObjects.createAsteroidObject(()=>a));
    });
    return asteroidObjs;
}

export class AsteroidObjects {

    static createShipObject(getState: ()=> IAsteroidState, getShip: ()=>IShip): SingleGameObject<IShip> {
        var ship: IShip = getShip();
        var state: IAsteroidState = getState();
        var mover: IActor = new MoveConstVelocity(() => { return {
            Vx: ship.Vx,
            Vy: ship.Vy,
        };}, (out: IMoveOut)=> {
            ship.x += out.dx;
            ship.y += out.dy;
        });
        // adding ship thrust force
        var rotator: IActor = new PolyRotator(() => { return {
            angle: ship.angle,
            shape: ship.shape,
        };}, (out: IShape)=> {
            ship.shape = out;
        });

        var shipView: IView = new PolyView(()=> { return {
            x: ship.x,
            y: ship.y,
            shape: ship.shape,
        };});

        var shipObj: SingleGameObject<IShip> = new SingleGameObject<IShip>(getShip, [mover, rotator], [shipView]);
        var shipController: IActor = AsteroidActors.createShipController(()=> { return {
            left: state.left,
            right: state.right,
            up: state.up,
            ship: state.ship,
        };});
        var explosionController: IActor = AsteroidActors.createExplosionController(()=> { return {
            ship: state.ship,
        };});
        shipObj.actors.push(shipController, explosionController);
        var wrapx:IActor = createWrapActor(()=> { return {
            value: ship.x,
            lowLimit: 0,
            upLimit: 512,
        };}, (a)=>ship.x = a);
        var wrapy:IActor = createWrapActor(()=> { return {
            value: ship.y,
            lowLimit: 0,
            upLimit: 480,
        };}, (a)=>ship.y = a);
        shipObj.actors.push(wrapx, wrapy);
        return shipObj;
    }

    public static createAsteroidObject(getAsteroid: ()=> IAsteroid): SingleGameObject<IAsteroid> {
        var asteroid: IAsteroid = getAsteroid();
        var mover: IActor = new MoveConstVelocity(() => { return {
            Vx: asteroid.Vx,
            Vy: asteroid.Vy,
        };}, (out: IMoveOut) => {
                asteroid.x += out.dx;
                asteroid.y += out.dy;
            }
        );
        var spinner: IActor = new Spinner(() => {
            return { spin: asteroid.spin };
        }, (sOut)=> asteroid.angle += sOut.dAngle);
        var rotator: IActor = new PolyRotator(() => { return {
            angle: asteroid.angle,
            shape: asteroid.shape,
        };}, (out: IShape)=> {
            asteroid.shape = out;
        });
        var wrapx:IActor = createWrapActor(()=> { return {
            value: asteroid.x,
            lowLimit: 0,
            upLimit: 512,
        };}, (a)=>asteroid.x = a);
        var wrapy:IActor = createWrapActor(()=> { return {
            value: asteroid.y,
            lowLimit: 0,
            upLimit: 480,
        };}, (a)=>asteroid.y = a);

        var view: IView = new PolyGraphicAngled(() => { return {
            x: asteroid.x,
            y: asteroid.y,
            shape: asteroid.shape,
            graphic: asteroid.graphic,
            angle: asteroid.angle,
        };});
        var asteroidObject: SingleGameObject<IAsteroid> = new SingleGameObject<IAsteroid>(getAsteroid,
            [mover, spinner, rotator, wrapx, wrapy], [view]);
        return asteroidObject;
    }

    static createWeaponObject(getState: ()=>IAsteroidState, getWeapon:()=> IWeapon): MultiGameObject<SingleGameObject<IParticle>> {

        var weapon: IWeapon = getWeapon();
        let bulletObjs: SingleGameObject<IParticle>[] = getWeapon().bullets.map((b)=> AsteroidObjects.createBulletObject(()=>b));
        var weaponObj: MultiGameObject<SingleGameObject<IParticle>> = new MultiGameObject([], [], ()=>bulletObjs);
        var age5: AgePred<IParticle> = new AgePred(
            ()=>weapon.bulletLifetime,
            (p: IParticle)=> p.born
        );
        var remover: ParticleRemover = new ParticleRemover(
            () => {
                ParticleRemover.remove(
                    ()=>weapon.bullets,
                    weaponObj.getComponents,
                    [age5]);});
        // add the generator to the field object
        weaponObj.actors.push(remover);

        var state: IAsteroidState = getState();
        var weaponController: IActor = AsteroidActors.createWeaponController(()=> { return {
            fire: state.fire,
            ship: state.ship,
            weapon: state.ship.weapon1,
        };}, (newParticle: IParticle) => {
            state.ship.weapon1.bullets.push(newParticle);
            var bulletObj: SingleGameObject<IParticle> = AsteroidObjects.createBulletObject(()=>newParticle);
            weaponObj.getComponents().push(bulletObj);
        });
        weaponObj.actors.push(weaponController);
        return weaponObj;
    }

    static createBulletObject(getParticle: ()=>IParticle): SingleGameObject<IParticle> {
        var particle: IParticle = getParticle();
        var mover: IActor = new MoveConstVelocity(
            () => particle,
            (out: IMoveOut) => {
                particle.x += out.dx;
                particle.y += out.dy;
            }
        );
        var view:IView = new RectangleView(()=> { return {
            x: particle.x,
            y: particle.y,
            width: particle.size,
            height: particle.size,
        };});
        let particleObj: SingleGameObject<IParticle> = new SingleGameObject<IParticle>(getParticle, [mover], [view]);
        var fireSound: IActor = new Sound("res/sound/raygun-01.mp3", true, false, ()=> { return {
            play: true,
        };});
        particleObj.actors.push(fireSound);
        return particleObj;
    }

    static createExhaustObj(getExhaust: ()=>IExhaust, getShip: ()=>IShip)
        : MultiGameObject<SingleGameObject<IParticle>> {
        var ship: IShip = getShip();
        var exhaustObj: MultiGameObject<SingleGameObject<IParticle>> = Field.createExhaustObj(getExhaust, ()=> {
        return {
            x: ship.x,
            y: ship.y,
            gravityOn: false,
            thrust: ship.thrust,
            xOffset: ship.shape.offset.x,
            yOffset: ship.shape.offset.y,
        };});
        var exhaustSound:IActor = new Sound(ship.exhaust.soundFilename, false, true, () => { return {
            play: getExhaust().on,
        };});
        exhaustObj.actors.push(exhaustSound);
        // var exhaustController: IActor = AsteroidActors.createExhaustController(()=> { return {
        //     up: state.up,
        //     ship: state.ship,
        // };});
        // exhaustObj.actors.push(exhaustController);
        return exhaustObj;
    }

    static createExplosionObj(getExplosion: ()=>IExplosion,
        getShip: ()=>IShip): MultiGameObject<SingleGameObject<IParticle>> {

        var explosion: IExplosion = getExplosion();
        var ship: IShip = getShip();
        var explosionObj: MultiGameObject<SingleGameObject<IParticle>>
            = Field.createExplosion(getExplosion, ()=> {
        return {
            x: ship.x,
            y: ship.y,
            gravityOn: false,
            thrust: ship.thrust,
            xOffset: ship.shape.offset.x,
            yOffset: ship.shape.offset.y,
        };});
        var explosionSound:IActor = new Sound(ship.explosion.soundFilename, true, false, () => { return {
            play: getExplosion().on,
        };});
        explosionObj.actors.push(explosionSound);
        var flashView: IView = new ScreenFlashView(()=> { return {
            x: 0,
            y: 0,
            width: 480,
            height: 512,
            on: ship.crashed,
            value: ship.explosion.flashScreenValue,
        };});
        explosionObj.views.push(flashView);
        // add flasher to value so screen changes
        var flasher:IActor = new Flasher(() => { return {
            enabled: ship.crashed,
            value: ship.explosion.flashScreenValue,
            repeat: 10,
        };}, (value:number)=> {
            ship.explosion.flashScreenValue = value;
        });
        explosionObj.actors.push(flasher);
        return explosionObj;
    }

    static createBallObject(getBall: ()=>IBall): SingleGameObject<IBall> {
        var ball: IBall = getBall();
        var ballView: IView = new CircleView(() => {
            return {
                x: ball.x,
                y: ball.y,
                r: ball.r,
            };
        });
        var obj: SingleGameObject<IBall>  = new SingleGameObject<IBall>(getBall, [], [ballView]);
        return obj;
    }

    static createShipBallObject(getShip: ()=>IShip, getBall: ()=>IBall): SingleGameObject<IRodInputs> {
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
        var line: LineView = new LineView(()=> {
            return {
                xFrom: ball.x,
                yFrom: ball.y,
                xTo: ship.x,
                yTo: ship.y,
            };
        });
        var r: SingleGameObject<IRodInputs> = new SingleGameObject(null, [rod], [line]);
        return r;
    }

    static createCoinObject(getCoin: ()=>ICoin): SingleGameObject<ICoin> {
        var coin:ICoin = getCoin();
        var animator: IActor = new SpriteAnimator(coin.sprite, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0.1]);
        var spinner: Spinner = new Spinner(()=> {
            return { spin: coin.spin };
        }, (sOut)=> coin.angle += sOut.dAngle);

        var view: IView = new SpriteAngledView(() => { return {
            x: coin.x,
            y: coin.y,
            angle: coin.angle,
            sprite: coin.sprite,
        };});
        var coinObj: SingleGameObject<ICoin> = new SingleGameObject<ICoin>(getCoin, [animator, spinner], [view]);
        return coinObj;
    }

    public static createGraphicShipObject(getGraphicShip: ()=>IGraphicShip): SingleGameObject<IGraphicShip> {
        var graphicShip: IGraphicShip = getGraphicShip();
        var shipView: IView = new GraphicAngledView(() => { return {
            x: graphicShip.x,
            y: graphicShip.y,
            angle: graphicShip.angle,
            graphic: graphicShip.graphic,
        };});
        var obj: SingleGameObject<IGraphicShip> = new SingleGameObject(getGraphicShip, [], [shipView]);
        return obj;
    }

}