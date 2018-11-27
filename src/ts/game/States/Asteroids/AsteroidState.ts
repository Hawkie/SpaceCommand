
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { CreateShip, IShip, DisplayShip, ShipCopyToUpdated,
    CrashShip, ShipCopyToRemovedBullet, ShipSounds } from "../../Components/Ship/ShipComponent";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { DisplayTitle } from "../../Components/TitleComponent";
import { IParticleField, CreateField } from "../../Components/FieldComponent";
import { DrawText } from "../../../gamelib/Views/TextView";
import { DrawNumber } from "../../../gamelib/Views/ValueView";
import { DrawCircle } from "../../../gamelib/Views/CircleView";
import { DrawLine } from "../../../gamelib/Views/LineView";
import { IAsteroid, UpdateAsteroid, CreateAsteroid } from "../../Components/Asteroids/AsteroidComponent";
import { IBall, CreateBall, CopyBallWithPos } from "../../Components/BallComponent";
import { IAsteroidStateStatic, CreateAsteroidGameStatic } from "./AsteroidGameStatic";
import { IAsteroidsControls, InputAsteroidControls } from "../../Components/AsteroidsControlsComponent";
import { KeyStateProvider } from "../../../gamelib/1Common/KeyStateProvider";
import { ICoin, CreateCoin, DisplayCoin, CopyCoinWithUpdate } from "../../Components/CoinComponent";
import { DisplayField, FieldGenMove } from "../../../gamelib/Components/ParticleFieldComponent";
import { IGraphicShip, CreateGraphicShip, DisplayGraphicShip } from "../../Components/GraphicShipComponent";
import { IAsteroids, CreateAsteroids, DisplayAsteroids, UpdateAsteroids } from "../../Components/Asteroids/AsteroidsComponent";
import { RemoveBullet } from "../../Components/Ship/WeaponComponent";
import { Wrap } from "../../../gamelib/Actors/Wrap";
import { Game2 } from "../../../gamelib/1Common/Game2";
import { DetectOne, IDetected } from "../../../gamelib/Interactors/CollisionDetector";

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

const asteroidStateStatic: IAsteroidStateStatic = CreateAsteroidGameStatic();

// demo to show mutate possible
// function mutate(state: {score: number}): void {
//     state.score = 50000;
// }

export function CreateAsteroidsState(ship: IShip,
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
    ShipSounds(state.ship);
    if (state.asteroids.asteroidHit) {
        Game2.assets.blast.replay();
        // turn off any sound triggers - need to think about this
        return {...state,
            asteroids: {...state.asteroids,
            asteroidHit: false }
        };
    }
    return state;
}

export function UpdateAsteroidsState(timeModifier: number, state: IAsteroidsState): IAsteroidsState {
    let newState: IAsteroidsState = Test(state);
    let ship: IShip = ShipCopyToUpdated(timeModifier, newState.ship, newState.controls);
    // wrap in this game state only
    ship = {...ship,
        x: Wrap(ship.x, 0, Game2.assets.width),
        y: Wrap(ship.y, 0, Game2.assets.height)
    };
    return {...newState,
        starField: FieldGenMove(timeModifier, newState.starField, true, 2, (now: number) => {
            return {
                x: Transforms.random(0, 512),
                y: 0,
                Vx: 0,
                Vy: Transforms.random(10, 30),
                born: now,
                size: 1,
            };
        }),
        asteroids: UpdateAsteroids(timeModifier, newState.asteroids),
        ship: ship,
        ball: CopyBallWithPos(timeModifier, newState.ball, ship.xTo, ship.yTo),
        coin: CopyCoinWithUpdate(timeModifier, newState.coin),
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

export function AsteroidHitPlayer(state: IAsteroidsState, Vx: number, Vy: number): IAsteroidsState {
    return {...state,
        ship: CrashShip(state.ship, Vx, Vy)
    };
}

export function InputAsteroidsState(state: IAsteroidsState, keys: KeyStateProvider): IAsteroidsState {
    return {...state,
        controls: InputAsteroidControls(keys.getKeys())
    };
}

export function BulletHitAsteroid(state: IAsteroidsState, asteroidIndex: number, bulletIndex: number): IAsteroidsState {
    let a:IAsteroid = state.asteroids.asteroids[asteroidIndex];
        // remove bullet
        // this.dataModel.ship.weapon1.bullets.splice(i2, 1);
        // remove asteroid
        let score: number = state.score;
        let level: number = state.level;
        let newAsteroids: IAsteroid[] = state.asteroids.asteroids.map(a => a);
        newAsteroids.splice(asteroidIndex, 1);

        // add two smaller asteroids
        if (a.size > 1) {
            for (let n:number = 0; n < 2; n++) {
                let newAsteroid:IAsteroid = CreateAsteroid(asteroidStateStatic.shapes,a.x, a.y, a.Vx, a.Vy, a.size - 1);
                newAsteroids.push(newAsteroid);
            }
        }
        score += 10;

        // if all asteroids cleared, create more at next level
        if (state.asteroids.asteroids.length === 0) {
            score += 50;
            level += 1;
            newAsteroids = CreateAsteroids(asteroidStateStatic, state.level);
        }

        return UpdateAsteroidsStateHit(state, newAsteroids, score, level, bulletIndex);
}

export function Test(state: IAsteroidsState): IAsteroidsState {
    const detected: IDetected = DetectOne(state.asteroids.asteroids.map((a)=> { return {
        location: {x: a.x, y: a.y},
        shape: a.shape,
    };}),
    state.ship.weapon1.bullets.map((b)=> { return {
        x: b.x,
        y: b.y,
    };}));
    if (detected !== undefined) {
        return BulletHitAsteroid(state, detected.indexAsteroid, detected.indexBullet);
    }
    // no hit
    return state;
}