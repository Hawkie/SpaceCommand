import { DrawContext} from "../../../gamelib/1Common/DrawContext";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { IInteractor } from "../../../gamelib/Interactors/Interactor";
import { Multi2ShapeCollisionDetector } from "../../../gamelib/Interactors/Multi2ShapeCollisionDetector";
import { Keys, KeyStateProvider } from "../../../gamelib/1Common/KeyStateProvider";
import { IAsteroidsState, CreateAsteroidsState, DisplayAsteroidsState,
    SoundAsteroidsState, InputAsteroidsState,
    UpdateAsteroidsState, AsteroidHitPlayer } from "./AsteroidState";
import { IAsteroid } from "../../Components/Asteroids/AsteroidComponent";
import { CreateShip, IShip } from "../../Components/Ship/ShipComponent";
import { IParticleField, CreateField } from "../../Components/FieldComponent";
import { MoveAttachedShip } from "../../Components/Ship/MovementComponent";
import { CreateView, IView, DisplayView, Zoom } from "../../Components/ViewPortComponent";

export interface IAsteroidsGameState {
    view: IView;
    asteroidsState: IAsteroidsState;
}

// export function createGameState(): IAsteroidsGameState {
//     // let spriteField: IGameObject = createSpriteField();

//     let ship: IShip = CreateShip(256, 240, 0, true, MoveAttachedShip);
//     let starfield: IParticleField = CreateField(true, 1, 1, 1);
//     let state: IAsteroidsState = CreateAsteroidsState(ship, starfield);
//     let view: IView = CreateView(false);
//     let asteroidState: AsteroidGameState = new AsteroidGameState("Asteroids", state, view);
//     return asteroidState;
// }

export function CreateAsteroidsGameState(): IAsteroidsGameState {
    // let spriteField: IGameObject = createSpriteField();

    let ship: IShip = CreateShip(256, 240, 0, true, MoveAttachedShip);
    let starfield: IParticleField = CreateField(true, 1, 1, 1);
    let state: IAsteroidsState = CreateAsteroidsState(ship, starfield);
    let view: IView = CreateView(false);
    let asteroidState: IAsteroidsGameState = {
        asteroidsState: state,
        view: view,
    };
    return asteroidState;
}

export class AsteroidGameState implements IAsteroidsGameState {
    interactors: IInteractor[] = [];

    constructor(public readonly name: string,
        public asteroidsState: IAsteroidsState,
        public view: IView,
        ) {
        // let asteroidBulletDetector: IInteractor = new Multi2FieldCollisionDetector(()=>
        //     this.state.asteroids.asteroids.map((a)=> { return {
        //         location: {x: a.x, y: a.y},
        //         shape: a.shape,
        //     };}),
        //     ()=> this.state.ship.weapon1.bullets.map((b)=> { return {
        //         x: b.x,
        //         y: b.y,
        //     };}),
        //     this.bulletHitAsteroid.bind(this));
        let asteroidPlayerDetector:IInteractor = new Multi2ShapeCollisionDetector(()=>
            this.asteroidsState.asteroids.asteroids.map((a)=> { return {
                location: {
                    x: a.x,
                    y: a.y},
                shape: a.shape,
            };}),
            ()=> { return {
                location: {
                    x: this.asteroidsState.ship.x,
                    y: this.asteroidsState.ship.y },
                shape: this.asteroidsState.ship.shape,
            };},
            this.asteroidPlayerHit.bind(this));
        this.interactors = [asteroidPlayerDetector]; // asteroidBulletDetector
    }


    update(timeModifier: number): void {
        this.asteroidsState = UpdateAsteroidsState(timeModifier, this.asteroidsState);
        this.view = Zoom(this.view, this.asteroidsState.controls.zoomIn, this.asteroidsState.controls.zoomOut);
    }

    // order is important. Like layers on top of each other.
    display(ctx: DrawContext): void {
        ctx.clear();
        DisplayView(ctx, this.view,
            this.asteroidsState.ship.x,
            this.asteroidsState.ship.y,
            this.asteroidsState, { displayState: DisplayAsteroidsState });
    }

    sound(timeModifier: number): void {
        const state: IAsteroidsState = this.asteroidsState;
        this.asteroidsState = SoundAsteroidsState(state);
    }

    input(keys: KeyStateProvider, timeModifier: number): void {
        const state: IAsteroidsState = this.asteroidsState;
        this.asteroidsState = InputAsteroidsState(state, keys);
    }

    // bulletHitAsteroid(asteroidIndex: number, bulletIndex: number): void {
    //     // effect on asteroid
    //     let a:IAsteroid = this.state.asteroids.asteroids[asteroidIndex];
    //     // remove bullet
    //     // this.dataModel.ship.weapon1.bullets.splice(i2, 1);
    //     // remove asteroid
    //     let score: number = this.state.score;
    //     let level: number = this.state.level;
    //     let newAsteroids: IAsteroid[] = this.state.asteroids.asteroids.map(a => a);
    //     newAsteroids.splice(asteroidIndex, 1);

    //     // add two smaller asteroids
    //     if (a.size > 1) {
    //         for (let n:number = 0; n < 2; n++) {
    //             let newAsteroid:IAsteroid = CreateAsteroid(this.asteroidStateStatic.shapes,a.x, a.y, a.Vx, a.Vy, a.size - 1);
    //             newAsteroids.push(newAsteroid);
    //         }
    //     }
    //     score += 10;

    //     // if all asteroids cleared, create more at next level
    //     if (this.state.asteroids.asteroids.length === 0) {
    //         score += 50;
    //         level += 1;
    //         newAsteroids = CreateAsteroids(this.asteroidStateStatic, this.state.level);
    //     }

    //     this.state = UpdateAsteroidsStateHit(this.state, newAsteroids, score, level, bulletIndex);
    // }

    asteroidPlayerHit(i1: number, i2: number): void {
        let a: IAsteroid = this.asteroidsState.asteroids.asteroids[i1];
        const Vx: number = a.Vx + Transforms.random(-2, 2);
        const Vy: number = a.Vy + Transforms.random(-2, 2);
        this.asteroidsState = AsteroidHitPlayer(this.asteroidsState, Vx, Vy);
    }

    tests(lastTestModifier: number): void {
        this.interactors.forEach(i => i.test(lastTestModifier));
    }

    returnState(): number {
        let s: number = undefined;
        if (this.asteroidsState.controls.exit) {
            s = 0;
        }
        return s;
    }
}

export function DisplayAsteroidsGameState(ctx: DrawContext, state: IAsteroidsGameState): void {
    ctx.clear();
    DisplayView(ctx, state.view,
        state.asteroidsState.ship.x,
        state.asteroidsState.ship.y,
        state.asteroidsState, { displayState: DisplayAsteroidsState });
}

export function SoundsAsteroidsGameState(state: IAsteroidsGameState): IAsteroidsGameState {
    return {...state,
        asteroidsState: SoundAsteroidsState(state.asteroidsState)
    };
}

export function InputAsteroidsGameState(state: IAsteroidsGameState, keys: KeyStateProvider): IAsteroidsGameState {
    return {...state,
        asteroidsState: InputAsteroidsState(state.asteroidsState, keys)
    };
}

export function UpdateAsteroidsGameState(state: IAsteroidsGameState, timeModifier: number): IAsteroidsGameState {
    let subState: IAsteroidsState = state.asteroidsState;
    subState = SoundAsteroidsState(subState);
    subState = UpdateAsteroidsState(timeModifier, subState);
    return {...state,
        asteroidsState: subState,
        view: state.view = Zoom(state.view, state.asteroidsState.controls.zoomIn, state.asteroidsState.controls.zoomOut),
    };
}

