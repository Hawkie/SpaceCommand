
import { Transforms } from "../../../gamelib/Physics/Transforms";
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
import { DisplayAsteroid, IAsteroid, CreateAsteroid, UpdateAsteroid, CreateAsteroidData } from "../../Components/AsteroidComponent";
import { IBall, CreateBall, UpdateBall, UpdateBallWithPos } from "../../Components/BallComponent";
import { IAsteroidStateStatic } from "./AsteroidGameStatic";
import { IAsteroidsControls, InputAsteroidControls } from "./Components/AsteroidsControlsComponent";
import { KeyStateProvider } from "../../../gamelib/1Common/KeyStateProvider";
import { ICoin, CreateCoin, DisplayCoin, UpdateCoin } from "../../Components/CoinComponent";
import { DisplayField, FieldGenMove } from "../../../gamelib/Components/ParticleFieldComponent";
import { IGraphicShip, CreateGraphicShip, DisplayGraphicShip } from "../../Components/GraphicShipComponent";

export interface IAsteroidsState {
    readonly controls: IAsteroidsControls;
    readonly starField: IParticleField;
    readonly ship: IShip;
    readonly ball: IBall;
    readonly coin: ICoin;
    readonly level: number;
    readonly asteroids: IAsteroids;
    readonly graphicShip: IGraphicShip;
    readonly score: number;
    readonly title: string;
}

export interface IAsteroids {
    readonly asteroids: ReadonlyArray<IAsteroid>;
    readonly playBreakSound: boolean;
}

export function CreateAsteroids(asteroidStateStatic: IAsteroidStateStatic, level: number): IAsteroid[] {
    let asteroids: IAsteroid[] = [];
    for (let i: number = 0; i < level; i++) {
        let a: IAsteroid = CreateAsteroidData(asteroidStateStatic, 3);
        asteroids.push(a);
    }
    return asteroids;
}

export function CreateAsteroidsState(asteroidStateStatic: IAsteroidStateStatic): IAsteroidsState {
    let asteroidState: IAsteroids = {
        asteroids: CreateAsteroids(asteroidStateStatic, 3),
        playBreakSound: false,
    };

    // things that change
    let asteroidData: IAsteroidsState = {
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
        graphicShip: CreateGraphicShip(200, 100),
        score: 0,
        title: "SpaceCommand",
    };
    return asteroidData;
}

export function DisplayAsteroidsState(ctx: DrawContext, state: IAsteroidsState): void {
    DisplayTitle(ctx, state.title);
    DisplayGUI(ctx, state.score, state.ship.angle);
    DisplayShip(ctx, state.ship);
    DisplayAttachedBall(ctx, state.ship, state.ball);
    DisplayAsteroids(ctx, state.asteroids);
    DisplayField(ctx, state.starField.particles);
    DisplayCoin(ctx, state.coin);
    DisplayGraphicShip(ctx, state.graphicShip);
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
    if (state.ship.exhaust.thrustOn) {
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
        starField: FieldGenMove(timeModifier, state.starField, true, 2, (now: number) => {
            return {
                x: Transforms.random(0, 512),
                y: 0,
                Vx: 0,
                Vy: Transforms.random(10, 30),
                born: now,
                size: 1,
            };
        }),
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

export function UpdateAsteroidsStateHit(state: IAsteroidsState,
    newAsteroids: ReadonlyArray<IAsteroid>,
    score:number,
    level: number): IAsteroidsState {
    return Object.assign({}, state, {
        asteroids: { asteroids: newAsteroids, playBreakSound: true },
        score: score,
        level: level,
    });
}

export function InputAsteroidsState(state: IAsteroidsState, keys: KeyStateProvider): IAsteroidsState {
    return Object.assign({}, state, {
        controls: InputAsteroidControls(keys.getKeys())
    });
}