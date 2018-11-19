import { Coordinate, ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
import { IShape, Shape } from "../../../gamelib/DataTypes/Shape";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { ISprite, HorizontalSpriteSheet } from "../../../gamelib/DataTypes/Sprite";
import { CreateShip, IShip, DisplayShip, UpdateShip } from "../../Components/Ship/ShipComponent";
import { IGameStateConfig } from "../../../gamelib/GameState/IGameStateConfig";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { DisplayTitle } from "../../Components/TitleComponent";
import { IParticleField, CreateField } from "../../Components/FieldComponent";
import { DrawText } from "../../../gamelib/Views/TextView";
import { DrawNumber } from "../../../gamelib/Views/ValueView";
import { DrawPoly } from "../../../gamelib/Views/PolyViews";
import { Game } from "../../Game/Game";
import { DrawCircle } from "../../../gamelib/Views/CircleView";
import { DrawLine } from "../../../gamelib/Views/LineView";
import { DrawSpriteAngled } from "../../../gamelib/Views/Sprites/SpriteAngledView";
import { DisplayAsteroid, IAsteroid, CreateAsteroid, UpdateAsteroid, CreateAsteroidData } from "../../Components/AsteroidComponent";
import { IBall, CreateBall, UpdateBall, UpdateBallWithPos } from "../../Components/BallComponent";
import { IAsteroidStateStatic } from "./AsteroidGameStatic";
import { IAsteroidsControls, InputAsteroidControls } from "./Components/AsteroidsControlsComponent";
import { KeyStateProvider } from "../../../gamelib/1Common/KeyStateProvider";
import { ICoin, CreateCoin, DisplayCoin, UpdateCoin } from "../../Components/CoinComponent";
import { DisplayField, UpdateField } from "../../../gamelib/Components/ParticleFieldComponent";

export interface IAsteroidsState {
    stateConfig: IGameStateConfig;
    controls: IAsteroidsControls;
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

export function createAsteroidsData(asteroidStateStatic: IAsteroidStateStatic, level: number): IAsteroid[] {
    let asteroids: IAsteroid[] = [];
    for (let i: number = 0; i < level; i++) {
        let a: IAsteroid = CreateAsteroidData(asteroidStateStatic, 3);
        asteroids.push(a);
    }
    return asteroids;
}



export function CreateAsteroidsState(asteroidStateStatic: IAsteroidStateStatic): IAsteroidsState {
    let asteroids: IAsteroid[] = createAsteroidsData(asteroidStateStatic, 3);
    let asteroidState: IAsteroids = {
        asteroids: asteroids,
        playBreakSound: false,
    };
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
            zoomIn: false,
            zoomOut: false,
            exit: false,
        },
        starField: CreateField(true, 1, 1, 1),
        ship: CreateShip(256, 240, 0),
        ball: CreateBall(256, 280),
        coin: CreateCoin(300, 400),
        level: 3,
        asteroids: asteroidState,
        graphicShip: createGraphicShipData(200, 100),
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

export function DisplayAsteroids(ctx: DrawContext, asteroids: IAsteroids): void {
    asteroids.asteroids.forEach((a)=> DisplayAsteroid(ctx, a, Game.assets.terrain));
}

export function DisplayAttachedBall(ctx: DrawContext, ship: IShip, ball: IBall): void {
    DrawCircle(ctx, ball.x, ball.y, ball.r);
    DrawLine(ctx, ship.x + ship.shape.offset.x, ship.y + ship.shape.offset.y, ball.x, ball.y);
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
    if (state.ship.weapon1.fired) {
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

    let ship: IShip = UpdateShip(timeModifier, state.ship, state.controls);
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
        asteroids: UpdateAsteroids(timeModifier, state.asteroids),
        ship: ship,
        ball: UpdateBallWithPos(timeModifier, state.ball, ship.xTo, ship.yTo),
        coin: UpdateCoin(timeModifier, state.coin),
        });
}

export function UpdateAsteroids(timeModifier: number, asteroids: IAsteroids): IAsteroids {
    return Object.assign({}, asteroids, {
        asteroids: asteroids.asteroids.map(a => UpdateAsteroid(timeModifier, a))
    });
}

export function InputAsteroidsState(state: IAsteroidsState, keys: KeyStateProvider): IAsteroidsState {
    return Object.assign({}, state, {
        controls: InputAsteroidControls(keys.getKeys())
    });
}