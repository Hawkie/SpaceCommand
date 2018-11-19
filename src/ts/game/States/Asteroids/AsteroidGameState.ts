import { DrawContext} from "../../../gamelib/1Common/DrawContext";
import { Coordinate, ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { IGameState } from "../../../gamelib/GameState/GameState";
import { IInteractor } from "../../../gamelib/Interactors/Interactor";
import { Multi2FieldCollisionDetector } from "../../../gamelib/Interactors/CollisionDetector";
import { Multi2ShapeCollisionDetector } from "../../../gamelib/Interactors/Multi2ShapeCollisionDetector";
import { Keys, KeyStateProvider } from "../../../gamelib/1Common/KeyStateProvider";
import { IAsteroidsState, CreateAsteroidsState, DisplayAsteroidsState,
    SoundAsteroidsState, createAsteroidsData, UpdateAsteroidsState, InputAsteroidsState } from "./AsteroidState";
// import { IAsteroidStateObject, createAsteroidStateObject } from "./createAsteroidStateObjects";
// import { createSpriteField } from "../../Objects/Asteroids/createSpriteField";
import { IAsteroid, CreateAsteroid } from "../../Components/AsteroidComponent";
import { IAsteroidStateStatic, CreateAsteroidGameStatic } from "./AsteroidGameStatic";



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

    constructor(public name: string,
        private asteroidStateStatic: IAsteroidStateStatic,
        private dataModel: IAsteroidsState,
        // private stateObj: IAsteroidStateObject,
        // private sceneObjects: IGameObject[]
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
        // this.sceneObjects.forEach(o => o.update(timeModifier));
        // this.stateObj.sceneObjs.forEach(x=>x.update(timeModifier));
        // this.stateObj.asteroidObjs.update(timeModifier);
        this.dataModel = UpdateAsteroidsState(timeModifier, this.dataModel);
    }

    // order is important. Like layers on top of each other.
    display(ctx: DrawContext): void {
        ctx.clear();
        // this.angle.model.value = this.player.chassisObj.model.physics.angle;
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
        // this.sceneObjects.forEach(o => o.display(ctx));
        // this.stateObj.sceneObjs.forEach(x=>x.display(ctx));
        // this.stateObj.asteroidObjs.display(ctx);
        // this.stateObj.views.forEach(x=>x.display(ctx));
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

    bulletHitAsteroid(i1: number, i2: number): void {
        // effect on asteroid
        let a:IAsteroid = this.dataModel.asteroids.asteroids[i1];
        // remove bullet
        this.dataModel.ship.weapon1.bullets.splice(i2, 1);
        // this.stateObj.weaponObj.getComponents().splice(i2, 1);

        // remove asteroid
        this.dataModel.asteroids.playBreakSound = true;
        this.dataModel.asteroids.asteroids.splice(i1, 1);
        // this.stateObj.asteroidObjs.getComponents().splice(i1, 1);
        // add two smaller asteroids
        // arrayAmender<IAsteroid>(;
        if (a.size > 1) {
            for (let n:number = 0; n < 2; n++) {
                let newAsteroid:IAsteroid = CreateAsteroid(this.asteroidStateStatic.shapes,a.x, a.y, a.Vx, a.Vy, a.size - 1);
                this.dataModel.asteroids.asteroids.push(newAsteroid);
                // let asteroidObj: SingleGameObject = createAsteroidObject(()=>newAsteroid);
                // this.stateObj.asteroidObjs.getComponents().push(asteroidObj);
            }
        }
        this.dataModel.score += 10;

        // if all asteroids cleared, create more at next level
        if (this.dataModel.asteroids.asteroids.length === 0) {
            this.dataModel.score += 50;
            this.dataModel.level += 1;
            // how do we ensure new asteroid objects bound to the new models in the state
            this.dataModel.asteroids.asteroids = createAsteroidsData(this.asteroidStateStatic, this.dataModel.level);
            for (let n:number = 0; n < this.dataModel.asteroids.asteroids.length; n++) {
                let a:IAsteroid = this.dataModel.asteroids.asteroids[n];
                // let asteroidObj: SingleGameObject = createAsteroidObject(()=>a);
                // this.stateObj.asteroidObjs.getComponents().push(asteroidObj);
            }
        }
    }

    asteroidPlayerHit(i1: number, i2: number): void {
        let a: IAsteroid = this.dataModel.asteroids.asteroids[i1];
        let xImpact: number = a.Vx;
        let yImpact: number = a.Vy;
        this.dataModel.ship.Vx = xImpact + Transforms.random(-2, 2);
        this.dataModel.ship.Vy = yImpact + Transforms.random(-2, 2);
        this.dataModel.ship.crashed = true;
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
