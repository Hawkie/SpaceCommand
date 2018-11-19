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
// import { IAsteroidStateObject, createAsteroidStateObject } from "./createAsteroidStateObjects";
// import { createSpriteField } from "../../Objects/Asteroids/createSpriteField";
import { IAsteroid, CreateAsteroid } from "../../Components/Asteroids/AsteroidComponent";
import { IAsteroidStateStatic, CreateAsteroidGameStatic } from "./AsteroidGameStatic";
import { CreateAsteroids } from "../../Components/Asteroids/AsteroidsComponent";



export function createGameState(): AsteroidGameState {
    // let spriteField: IGameObject = createSpriteField();
    let asteroidStateStatic: IAsteroidStateStatic = CreateAsteroidGameStatic();
    let state: IAsteroidsState = CreateAsteroidsState(asteroidStateStatic);
    // let stateObj: IAsteroidStateObject = createAsteroidStateObject(() => state);
    // get state objects and add asteroid objects
    let asteroidState: AsteroidGameState = new AsteroidGameState("Asteroids", asteroidStateStatic, state);
    return asteroidState;
}


export class AsteroidGameState implements IGameState {
    interactors: IInteractor[] = [];
    viewScale: number;
    zoom: number;
    exitState: boolean = false;

    constructor(public readonly name: string,
        private readonly asteroidStateStatic: IAsteroidStateStatic,
        private dataModel: IAsteroidsState,
        ) {
        this.viewScale = 1;
        this.zoom = 1;
        let asteroidBulletDetector: IInteractor = new Multi2FieldCollisionDetector(()=>
            this.dataModel.asteroids.asteroids.map((a)=> { return {
                location: {x: a.x, y: a.y},
                shape: a.shape,
            };}),
            ()=> this.dataModel.ship.weapon1.bullets.map((b)=> { return {
                x: b.x,
                y: b.y,
            };}),
            this.bulletHitAsteroid.bind(this));
        let asteroidPlayerDetector:IInteractor = new Multi2ShapeCollisionDetector(()=>
            this.dataModel.asteroids.asteroids.map((a)=> { return {
                location: {
                    x: a.x,
                    y: a.y},
                shape: a.shape,
            };}),
            ()=> { return {
                location: {
                    x: this.dataModel.ship.x,
                    y: this.dataModel.ship.y },
                shape: this.dataModel.ship.shape,
            };},
            this.asteroidPlayerHit.bind(this));
        this.interactors = [asteroidBulletDetector, asteroidPlayerDetector];
    }


    update(timeModifier: number): void {
        this.dataModel = UpdateAsteroidsState(timeModifier, this.dataModel);
    }

    // order is important. Like layers on top of each other.
    display(ctx: DrawContext): void {
        ctx.clear();
        ctx.save();
        let x: number  = this.dataModel.ship.x;
        let y: number = this.dataModel.ship.y;
        if (this.dataModel.controls.zoomIn) {
            this.viewScale = 0.01;
        } else if (this.dataModel.controls.zoomOut && this.zoom > 1) {
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
        DisplayAsteroidsState(ctx, this.dataModel);
        ctx.restore();
    }

    sound(timeModifier: number): void {
        const state: IAsteroidsState = this.dataModel;
        this.dataModel = SoundAsteroidsState(state);
    }

    input(keys: KeyStateProvider, timeModifier: number): void {
        const state: IAsteroidsState = this.dataModel;
        this.dataModel = InputAsteroidsState(state, keys);
    }

    bulletHitAsteroid(asteroidIndex: number, bulletIndex: number): void {
        // effect on asteroid
        let a:IAsteroid = this.dataModel.asteroids.asteroids[asteroidIndex];
        // remove bullet
        // this.dataModel.ship.weapon1.bullets.splice(i2, 1);
        // remove asteroid
        let score: number = this.dataModel.score;
        let level: number = this.dataModel.level;
        let newAsteroids: IAsteroid[] = this.dataModel.asteroids.asteroids.map(a => a);
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
        if (this.dataModel.asteroids.asteroids.length === 0) {
            score += 50;
            level += 1;
            newAsteroids = CreateAsteroids(this.asteroidStateStatic, this.dataModel.level);
        }

        this.dataModel = UpdateAsteroidsStateHit(this.dataModel, newAsteroids, score, level, bulletIndex);
    }

    asteroidPlayerHit(i1: number, i2: number): void {
        let a: IAsteroid = this.dataModel.asteroids.asteroids[i1];
        const Vx: number = a.Vx + Transforms.random(-2, 2);
        const Vy: number = a.Vy + Transforms.random(-2, 2);
        this.dataModel = UpdateAsteroidsStatePlayerHit(this.dataModel, Vx, Vy);
    }

    tests(lastTestModifier: number): void {
        this.interactors.forEach(i => i.test(lastTestModifier));
    }

    returnState(): number {
        let s: number = undefined;
        if (this.dataModel.controls.exit) {
            s = 0;
        }
        return s;
    }

}
