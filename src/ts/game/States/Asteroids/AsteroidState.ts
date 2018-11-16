import { Coordinate, ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
import { IShape, Shape } from "../../../gamelib/DataTypes/Shape";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { ISprite, HorizontalSpriteSheet } from "../../../gamelib/DataTypes/Sprite";
import { IParticle } from "../../Objects/Particle/IParticle";
import { createShip, IShip } from "../../Objects/Ship/IShip";
import { IGameStateConfig } from "../../../gamelib/GameState/IGameStateConfig";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { DisplayTitle } from "../../Components/TitleComponent";
import { DisplayField, IParticleField, UpdateField, CreateField } from "../../Components/FieldComponent";
import { DrawText } from "../../../gamelib/Views/TextView";
import { DrawNumber } from "../../../gamelib/Views/ValueView";
import { DrawPoly } from "../../../gamelib/Views/PolyViews";
import { Game } from "../../Game/Game";
import { DrawCircle } from "../../../gamelib/Views/CircleView";
import { DrawLine } from "../../../gamelib/Views/LineView";
import { DrawSpriteAngled } from "../../../gamelib/Views/Sprites/SpriteAngledView";
import { DisplayAsteroid, IAsteroid, CreateAsteroid, UpdateAsteroid } from "../../Components/AsteroidComponent";
import { IBall, CreateBall, UpdateBall } from "../../Components/BallComponent";
import { IAsteroidStateStatic } from "./AsteroidGameStatic";

export interface IAsteroidsState {
    stateConfig: IGameStateConfig;
    controls: IControls;
    starField: IParticleField;
    ship: IShip;
    ball: IBall;
    coin: ICoin;
    level: number;
    asteroids: IAsteroids;
    graphicShip: IGraphicShip;
    score: number;
    title: string;
}

export interface IControls {
    left: boolean;
    right: boolean;
    up: boolean;
    fire: boolean;
}

export interface IAsteroids {
    asteroids: IAsteroid[];
    playBreakSound: boolean;
}

export interface IGraphicShip {
    x: number;
    y: number;
    Vx: number;
    Vy: number;
    angle: number;
    spin: number;
    mass: number;
    graphic: string;
}

export interface ICoin {
    x: number;
    y: number;
    Vx: number;
    Vy: number;
    angle: number;
    spin: number;
    mass: number;
    sprite: ISprite;
}

export function createAsteroidsData(asteroidStateStatic: IAsteroidStateStatic, level: number): IAsteroid[] {
    let asteroids: IAsteroid[] = [];
    for (let i: number = 0; i < level; i++) {
        let a: IAsteroid = createAsteroidData(asteroidStateStatic, 3);
        asteroids.push(a);
    }
    return asteroids;
}

function createAsteroidData(asteroidStateStatic: IAsteroidStateStatic, size: number): IAsteroid {
    let xy: number = Transforms.random(0, 3);
    let x: number = Transforms.random(0,512), y: number = Transforms.random(0, 480);
    if (xy === 0) {
        x = Transforms.random(0, 100);
    } else if (xy === 1) {
        x = Transforms.random(412, 512);
    } else if (xy === 2) {
        y = Transforms.random(0, 100);
    } else if (xy === 3) {
        y = Transforms.random(380, 480);
    }
    return CreateAsteroid(asteroidStateStatic.shapes, x,y, 0, 0, size);
}

export function CreateAsteroidsState(asteroidStateStatic: IAsteroidStateStatic): IAsteroidsState {
    let ship: IShip = createShip(256, 240, 0);
    let coin: ICoin = createCoinData(new Coordinate(300, 400));
    let asteroids: IAsteroid[] = createAsteroidsData(asteroidStateStatic, 3);
    let asteroidState: IAsteroids = {
        asteroids: asteroids,
        playBreakSound: false,
    };
    let graphicShip: IGraphicShip = createGraphicShipData(200, 100);
    let stateConfig: IGameStateConfig = {
        screenWrap: true,
        gravity: false,
    };

    // things that change
    let asteroidData: IAsteroidsState = {
        stateConfig: stateConfig,
        controls: {
            left: false,
            right: false,
            up: false,
            fire: false,
        },
        starField: CreateField(true, 1, 1, 1),
        ship: ship,
        ball: CreateBall(256, 280),
        coin: coin,
        level: 3,
        asteroids: asteroidState,
        graphicShip: graphicShip,
        score: 0,
        title: "SpaceCommand",
    };
    return asteroidData;
}

export function createGraphicShipData(x: number, y:number): IGraphicShip {
    let gShip: IGraphicShip = {
        x: x,
        y: y,
        Vx: 0,
        Vy: 0,
        angle: 10,
        spin: 0,
        mass: 1,
        graphic: "res/img/ship.png",
    };
    return gShip;
}

export function createCoinData(location: Coordinate): ICoin {
    let s: ISprite = new HorizontalSpriteSheet("res/img/spinningCoin.png", 46, 42, 10, 0, 0.5, 0.5);
    let coin: ICoin = {
        x: location.x,
        y: location.y,
        Vx: 0,
        Vy: 0,
        angle: 45,
        spin: 4,
        mass: 1,
        sprite: s,
    };
    return coin;
}


export function DisplayAsteroidsState(ctx: DrawContext, state: IAsteroidsState): void {
    DisplayTitle(ctx, state.title);
    DisplayGUI(ctx, state.score, state.ship.angle);
    DisplayShip(ctx, state.ship);
    DisplayAttachedBall(ctx, state.ship, state.ball);
    DisplayAsteroids(ctx, state.asteroids);
    DisplayField(ctx, state.starField.particles);
    DisplayCoin(ctx, state.coin);
}


export function DisplayGUI(ctx: DrawContext, score: number, angle: number): void {
    DrawText(ctx, 400, 20, "Score:", "Arial", 18);
    DrawNumber(ctx, 460, 20, score, "Arial", 18);
    DrawText(ctx, 400, 20, "Score:", "Arial", 18);
    DrawNumber(ctx, 460, 40, angle, "Arial", 18);
}

export function DisplayShip(ctx: DrawContext, ship: IShip): void {
    DrawPoly(ctx, ship.x + ship.shape.offset.x, ship.y + ship.shape.offset.y, ship.shape);
    DisplayField(ctx, ship.exhaust.exhaustParticleField.particles);
    DisplayField(ctx, ship.explosion.explosionParticleField.particles);
    DisplayField(ctx, ship.weapon1.bullets);
}


export function DisplayAsteroids(ctx: DrawContext, asteroids: IAsteroids): void {
    asteroids.asteroids.forEach((a)=> DisplayAsteroid(ctx, a, Game.assets.terrain));
}

export function DisplayAttachedBall(ctx: DrawContext, ship: IShip, ball: IBall): void {
    DrawCircle(ctx, ball.x, ball.y, ball.r);
    DrawLine(ctx, ship.x + ship.shape.offset.x, ship.y + ship.shape.offset.y, ball.x, ball.y);
}

// move graphic part of sprite to assetsg
export function DisplayCoin(ctx: DrawContext, coin: ICoin): void {
    DrawSpriteAngled(ctx, coin.x, coin.y, coin.angle, coin.sprite, Game.assets.coinSprite);
}

export function SoundAsteroidsState(state: IAsteroidsState): IAsteroidsState {
    if (state.ship.crashed) {
        Game.assets.explosion.playOnce();
    }
    if (state.ship.exhaust.exhaustParticleField.on) {
        Game.assets.thrust.play();
    } else {
        Game.assets.thrust.pause();
    }
    if (state.asteroids.playBreakSound) {
        Game.assets.blast.replay();
    }
    if (state.controls.fire) {
        Game.assets.gun.replay();
    }
    // turn off any sounds that were triggered
    return Object.assign({}, state, {
        asteroids: Object.assign({}, state.asteroids, {
            playBreakSound: false
        })
    });
}

export function UpdateAsteroidsState(timeModifier: number, state: IAsteroidsState): IAsteroidsState {
    // turn off any sounds that were triggered
    return Object.assign({}, state, {
        starField: UpdateField(timeModifier, state.starField, true, 2, (now: number) => {
            return {
                x: Transforms.random(0, 512),
                y: 0,
                Vx: 0,
                Vy: Transforms.random(10, 30),
                born: now,
                size: 1,
            };
        }),
        // ball: UpdateBall(timeModifier, state.ball),
        asteroids: UpdateAsteroids(timeModifier, state.asteroids)
        });
}

export function UpdateAsteroids(timeModifier: number, asteroids: IAsteroids): IAsteroids {
    return Object.assign({}, asteroids, {
        asteroids: asteroids.asteroids.map(a => UpdateAsteroid(timeModifier, a))
    });
}