import { DrawContext} from "../../../gamelib/1Common/DrawContext";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { IGameState } from "../../../gamelib/GameState/GameState";
import { IInteractor } from "../../../gamelib/Interactors/Interactor";
import { Multi2FieldCollisionDetector } from "../../../gamelib/Interactors/CollisionDetector";
import { Multi2ShapeCollisionDetector } from "../../../gamelib/Interactors/Multi2ShapeCollisionDetector";
import { Keys, KeyStateProvider } from "../../../gamelib/1Common/KeyStateProvider";
import { IAsteroidsState, CreateAsteroidsState, DisplayAsteroidsState,
    SoundAsteroidsState, InputAsteroidsState,
    UpdateAsteroidsState, UpdateAsteroidsStateHit, UpdateAsteroidsStatePlayerHit } from "./AsteroidState";
import { IAsteroid, CreateAsteroid } from "../../Components/Asteroids/AsteroidComponent";
import { IAsteroidStateStatic, CreateAsteroidGameStatic } from "./AsteroidGameStatic";
import { CreateAsteroids } from "../../Components/Asteroids/AsteroidsComponent";
import { CreateShip, IShip } from "../../Components/Ship/ShipComponent";
import { IParticleField, CreateField } from "../../Components/FieldComponent";
import { UpdateConnection } from "../../../gamelib/Actors/CompositeAccelerator";
import { MoveAttachedShip } from "../../Components/Ship/MovementComponent";



export function createGameState(): AsteroidGameState {
    // let spriteField: IGameObject = createSpriteField();
    let asteroidStateStatic: IAsteroidStateStatic = CreateAsteroidGameStatic();
    let ship: IShip = CreateShip(256, 240, 0, true, true, MoveAttachedShip);
    let starfield: IParticleField = CreateField(true, 1, 1, 1);
    let state: IAsteroidsState = CreateAsteroidsState(asteroidStateStatic, ship, starfield);
    // let stateObj: IAsteroidStateObject = createAsteroidStateObject(() => state);
    // get state objects and add asteroid objects
    let asteroidState: AsteroidGameState = new AsteroidGameState("Asteroids", asteroidStateStatic, state);
    return asteroidState;
}


export class AsteroidGameState implements IGameState {
    interactors: IInteractor[] = [];
    viewScale: number;
    zoom: number;

    constructor(public readonly name: string,
        private readonly asteroidStateStatic: IAsteroidStateStatic,
        private state: IAsteroidsState,
        ) {
        this.viewScale = 1;
        this.zoom = 1;
        let asteroidBulletDetector: IInteractor = new Multi2FieldCollisionDetector(()=>
            this.state.asteroids.asteroids.map((a)=> { return {
                location: {x: a.x, y: a.y},
                shape: a.shape,
            };}),
            ()=> this.state.ship.weapon1.bullets.map((b)=> { return {
                x: b.x,
                y: b.y,
            };}),
            this.bulletHitAsteroid.bind(this));
        let asteroidPlayerDetector:IInteractor = new Multi2ShapeCollisionDetector(()=>
            this.state.asteroids.asteroids.map((a)=> { return {
                location: {
                    x: a.x,
                    y: a.y},
                shape: a.shape,
            };}),
            ()=> { return {
                location: {
                    x: this.state.ship.x,
                    y: this.state.ship.y },
                shape: this.state.ship.shape,
            };},
            this.asteroidPlayerHit.bind(this));
        this.interactors = [asteroidBulletDetector, asteroidPlayerDetector];
    }


    update(timeModifier: number): void {
        this.state = UpdateAsteroidsState(timeModifier, this.state);
    }

    // order is important. Like layers on top of each other.
    display(ctx: DrawContext): void {
        ctx.clear();
        ctx.save();
        let x: number  = this.state.ship.x;
        let y: number = this.state.ship.y;
        if (this.state.controls.zoomIn) {
            this.viewScale = 0.01;
        } else if (this.state.controls.zoomOut && this.zoom > 1) {
            this.viewScale = -0.01;
        } else {
            this.viewScale = 0;
        }
        this.zoom *= 1 + this.viewScale;

        ctx.translate(x * (1 - this.zoom), y * (1 - this.zoom));
        // move origin to location of ship - location of ship factored by zoom
        // if zoom = 1 no change
        // if zoom > 1 then drawing origin moves to -ve figures and object coordinates can start off the top left of screen
        // if zoom < 1 then drawing origin moves to +ve figires and coordinates offset closer into screen
        ctx.zoom(this.zoom, this.zoom);
        DisplayAsteroidsState(ctx, this.state);
        ctx.restore();
    }

    sound(timeModifier: number): void {
        const state: IAsteroidsState = this.state;
        this.state = SoundAsteroidsState(state);
    }

    input(keys: KeyStateProvider, timeModifier: number): void {
        const state: IAsteroidsState = this.state;
        this.state = InputAsteroidsState(state, keys);
    }

    bulletHitAsteroid(asteroidIndex: number, bulletIndex: number): void {
        // effect on asteroid
        let a:IAsteroid = this.state.asteroids.asteroids[asteroidIndex];
        // remove bullet
        // this.dataModel.ship.weapon1.bullets.splice(i2, 1);
        // remove asteroid
        let score: number = this.state.score;
        let level: number = this.state.level;
        let newAsteroids: IAsteroid[] = this.state.asteroids.asteroids.map(a => a);
        newAsteroids.splice(asteroidIndex, 1);

        // add two smaller asteroids
        if (a.size > 1) {
            for (let n:number = 0; n < 2; n++) {
                let newAsteroid:IAsteroid = CreateAsteroid(this.asteroidStateStatic.shapes,a.x, a.y, a.Vx, a.Vy, a.size - 1);
                newAsteroids.push(newAsteroid);
            }
        }
        score += 10;

        // if all asteroids cleared, create more at next level
        if (this.state.asteroids.asteroids.length === 0) {
            score += 50;
            level += 1;
            newAsteroids = CreateAsteroids(this.asteroidStateStatic, this.state.level);
        }

        this.state = UpdateAsteroidsStateHit(this.state, newAsteroids, score, level, bulletIndex);
    }

    asteroidPlayerHit(i1: number, i2: number): void {
        let a: IAsteroid = this.state.asteroids.asteroids[i1];
        const Vx: number = a.Vx + Transforms.random(-2, 2);
        const Vy: number = a.Vy + Transforms.random(-2, 2);
        this.state = UpdateAsteroidsStatePlayerHit(this.state, Vx, Vy);
    }

    tests(lastTestModifier: number): void {
        this.interactors.forEach(i => i.test(lastTestModifier));
    }

    returnState(): number {
        let s: number = undefined;
        if (this.state.controls.exit) {
            s = 0;
        }
        return s;
    }

}
