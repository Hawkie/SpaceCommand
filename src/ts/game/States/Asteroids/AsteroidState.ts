
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { CreateShip, IShip, DisplayShip, ShipCopyToUpdated,
    ShipCopyToCrashedShip, ShipCopyToRemovedBullet } from "../../Components/Ship/ShipComponent";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { DisplayTitle } from "../../Components/TitleComponent";
import { IParticleField, CreateField } from "../../Components/FieldComponent";
import { DrawText } from "../../../gamelib/Views/TextView";
import { DrawNumber } from "../../../gamelib/Views/ValueView";
import { Game } from "../../Game/Game";
import { DrawCircle } from "../../../gamelib/Views/CircleView";
import { DrawLine } from "../../../gamelib/Views/LineView";
import { IAsteroid, UpdateAsteroid } from "../../Components/Asteroids/AsteroidComponent";
import { IBall, CreateBall, CopyBallWithPos } from "../../Components/BallComponent";
import { IAsteroidStateStatic } from "./AsteroidGameStatic";
import { IAsteroidsControls, InputAsteroidControls } from "../../Components/AsteroidsControlsComponent";
import { KeyStateProvider } from "../../../gamelib/1Common/KeyStateProvider";
import { ICoin, CreateCoin, DisplayCoin, CopyCoinWithUpdate } from "../../Components/CoinComponent";
import { DisplayField, FieldGenMove } from "../../../gamelib/Components/ParticleFieldComponent";
import { IGraphicShip, CreateGraphicShip, DisplayGraphicShip } from "../../Components/GraphicShipComponent";
import { IAsteroids, CreateAsteroids, DisplayAsteroids, UpdateAsteroids } from "../../Components/Asteroids/AsteroidsComponent";
import { RemoveBullet } from "../../Components/Ship/WeaponComponent";

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

// demo to show mutate possible
// function mutate(state: {score: number}): void {
//     state.score = 50000;
// }

export function CreateAsteroidsState(asteroidStateStatic: IAsteroidStateStatic, ship: IShip,
    starfield: IParticleField): IAsteroidsState {
    let asteroidState: IAsteroids = {
        asteroids: CreateAsteroids(asteroidStateStatic, 3),
        asteroidHit: false,
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
        starField: starfield,
        ship: ship,
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
    if (state.asteroids.asteroidHit) {
        Game.assets.blast.replay();
    }
    if (state.ship.weapon1.fired) {
        Game.assets.gun.replay();
    }
    // turn off any sound triggers - need to think about this
    return {...state,
        asteroids: {...state.asteroids,
            asteroidHit: false }
    };
}

export function UpdateAsteroidsState(timeModifier: number, state: IAsteroidsState): IAsteroidsState {
    let ship: IShip = ShipCopyToUpdated(timeModifier, state.ship, state.controls);
    return {...state,
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
        ball: CopyBallWithPos(timeModifier, state.ball, ship.xTo, ship.yTo),
        coin: CopyCoinWithUpdate(timeModifier, state.coin),
    };
}

export function UpdateAsteroidsStateHit(state: IAsteroidsState,
    newAsteroids: ReadonlyArray<IAsteroid>,
    score:number,
    level: number,
    bulletIndex:number): IAsteroidsState {
    return {...state,
        asteroids: { asteroids: newAsteroids, asteroidHit: true },
        score: score,
        level: level,
        ship: ShipCopyToRemovedBullet(state.ship, bulletIndex),
    };
}

export function UpdateAsteroidsStatePlayerHit(state: IAsteroidsState, Vx: number, Vy: number): IAsteroidsState {
    return {...state,
        ship: ShipCopyToCrashedShip(state.ship, Vx, Vy)
    };
}

export function InputAsteroidsState(state: IAsteroidsState, keys: KeyStateProvider): IAsteroidsState {
    return {...state,
        controls: InputAsteroidControls(keys.getKeys())
    };
}