import { DrawContext} from "ts/gamelib/1Common/DrawContext";
import { Assets } from "ts/gamelib/1Common/Assets";
import { Coordinate, ICoordinate } from "ts/gamelib/Data/Coordinate";
import { Transforms } from "ts/gamelib/Physics/Transforms";
import { IGameState } from "ts/gamelib/GameState/GameState";
import { IInteractor } from "ts/gamelib/Interactors/Interactor";
import { Multi2FieldCollisionDetector } from "ts/gamelib/Interactors/CollisionDetector";
import { Multi2ShapeCollisionDetector } from "ts/gamelib/Interactors/Multi2ShapeCollisionDetector";
import { Keys, KeyStateProvider } from "ts/gamelib/1Common/KeyStateProvider";
import { IGameObject } from "../../../gamelib/GameObjects/IGameObject";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
import { AsteroidModels, IBall, IAsteroid,
    IGraphicShip, ICoin, IAsteroidData, createAsteroidData } from "./createAsteroidData";
import { IAsteroidStateObject, createAsteroidStateObject } from "./createAsteroidStateObjects";
import { createAsteroidObject } from "ts/game/Objects/Asteroids/createAsteroidObject";
import { createSpriteField } from "../../Objects/Asteroids/createSpriteField";

export function createGameState(assets: Assets, actx: AudioContext): AsteroidGameState {
    var spriteField: IGameObject = createSpriteField();
    var state: IAsteroidData = createAsteroidData();
    var stateObj: IAsteroidStateObject = createAsteroidStateObject(() => state);
    // get state objects and add asteroid objects
    var asteroidState: AsteroidGameState = new AsteroidGameState("Asteroids", assets, actx, state, stateObj, [spriteField]);
    return asteroidState;
}

export class AsteroidGameState implements IGameState {
    interactors: IInteractor[] = [];
    viewScale: number;
    zoom: number;
    exitState: boolean = false;

    constructor(public name: string,
        private assets: Assets,
        private actx: AudioContext,
        private dataModel: IAsteroidData,
        private stateObj: IAsteroidStateObject,
        private sceneObjects: IGameObject[]
        ) {
        this.viewScale = 1;
        this.zoom = 1;
        var asteroidBulletDetector: IInteractor = new Multi2FieldCollisionDetector(()=>
            this.dataModel.asteroids.asteroids.map((a)=> { return {
                location: {x: a.x, y: a.y},
                shape: a.shape,
            };}),
            ()=> this.dataModel.ship.weapon1.bullets.map((b)=> { return {
                x: b.x,
                y: b.y,
            };}),
            this.bulletHitAsteroid.bind(this));
        var asteroidPlayerDetector:IInteractor = new Multi2ShapeCollisionDetector(()=>
            this.dataModel.asteroids.asteroids.map((a)=> { return {
                location: {x: a.x, y: a.y},
                shape: a.shape,
            };}),
            ()=> { return {
                location: {x: this.dataModel.ship.x, y: this.dataModel.ship.y },
                shape: this.dataModel.ship.shape,
            };},
            this.asteroidPlayerHit.bind(this));
        this.interactors = [asteroidBulletDetector, asteroidPlayerDetector];
    }


    update(lastDrawModifier: number): void {
        this.sceneObjects.forEach(o => o.update(lastDrawModifier));
        this.stateObj.sceneObjs.forEach(x=>x.update(lastDrawModifier));
        this.stateObj.asteroidObjs.update(lastDrawModifier);
    }

    // order is important. Like layers on top of each other.
    display(drawingContext: DrawContext): void {
        drawingContext.clear();
        // this.angle.model.value = this.player.chassisObj.model.physics.angle;
        drawingContext.save();
        let x: number  = this.dataModel.ship.x;
        let y: number = this.dataModel.ship.y;
        drawingContext.translate(x * (1 - this.zoom), y * (1 - this.zoom));
        // move origin to location of ship - location of ship factored by zoom
        // if zoom = 1 no change
        // if zoom > 1 then drawing origin moves to -ve figures and object coordinates can start off the top left of screen
        // if zoom < 1 then drawing origin moves to +ve figires and coordinates offset closer into screen
        drawingContext.zoom(this.zoom, this.zoom);
        this.sceneObjects.forEach(o => o.display(drawingContext));
        this.stateObj.sceneObjs.forEach(x=>x.display(drawingContext));
        this.stateObj.asteroidObjs.display(drawingContext);
        this.stateObj.views.forEach(x=>x.display(drawingContext));
        drawingContext.restore();
    }

    sound(actx: AudioContext): void {
        //
    }

    input(keys: KeyStateProvider, lastDrawModifier: number): void {
        if (keys.isKeyDown(Keys.UpArrow)) {
            this.dataModel.controls.up = true;
        } else {
            this.dataModel.controls.up = false;
        }
        if (keys.isKeyDown(Keys.LeftArrow)) {
            this.dataModel.controls.left = true;
        } else {
            this.dataModel.controls.left = false;
        }
        if (keys.isKeyDown(Keys.RightArrow)) {
            this.dataModel.controls.right = true;
        } else {
            this.dataModel.controls.right = false;
        }
        if (keys.isKeyDown(Keys.SpaceBar)) {
            this.dataModel.controls.fire = true;
        } else {
            this.dataModel.controls.fire = false;
        }
        if (keys.isKeyDown(Keys.Z)) {
            this.viewScale = 0.01;
        } else if (keys.isKeyDown(Keys.X) && this.zoom > 1) {
            this.viewScale = -0.01;
        } else {
            this.viewScale = 0;
        }
        this.zoom *= 1 + this.viewScale;
        if (keys.isKeyDown(Keys.Esc)) {
            this.exitState = true;
        }
    }

    bulletHitAsteroid(i1: number, i2: number): void {
        // effect on asteroid
        let a:IAsteroid = this.dataModel.asteroids.asteroids[i1];
        // remove bullet
        this.dataModel.ship.weapon1.bullets.splice(i2, 1);
        this.stateObj.weaponObj.getComponents().splice(i2, 1);

        // remove asteroid
        this.dataModel.asteroids.playBreakSound = true;
        this.dataModel.asteroids.asteroids.splice(i1, 1);
        this.stateObj.asteroidObjs.getComponents().splice(i1, 1);
        // add two smaller asteroids
        // arrayAmender<IAsteroid>(;
        if (a.size > 1) {
            for (let n:number = 0; n < 2; n++) {
                var newAsteroid:IAsteroid = AsteroidModels.createAsteroidDataAt(a.x, a.y, a.Vx, a.Vy, a.size - 1);
                this.dataModel.asteroids.asteroids.push(newAsteroid);
                var asteroidObj: SingleGameObject = createAsteroidObject(()=>newAsteroid);
                this.stateObj.asteroidObjs.getComponents().push(asteroidObj);
            }
        }
        this.dataModel.score += 10;

        // if all asteroids cleared, create more at next level
        if (this.dataModel.asteroids.asteroids.length === 0) {
            this.dataModel.score += 50;
            this.dataModel.level += 1;
            // how do we ensure new asteroid objects bound to the new models in the state
            this.dataModel.asteroids.asteroids = AsteroidModels.createAsteroidsData(this.dataModel.level);
            for (let n:number = 0; n < this.dataModel.asteroids.asteroids.length; n++) {
                let a:IAsteroid = this.dataModel.asteroids.asteroids[n];
                let asteroidObj: SingleGameObject = createAsteroidObject(()=>a);
                this.stateObj.asteroidObjs.getComponents().push(asteroidObj);
            }
        }
    }

    asteroidPlayerHit(i1: number, i2: number): void {
        var a: IAsteroid = this.dataModel.asteroids.asteroids[i1];
        var xImpact: number = a.Vx;
        var yImpact: number = a.Vy;
        this.dataModel.ship.Vx = xImpact + Transforms.random(-2, 2);
        this.dataModel.ship.Vy = yImpact + Transforms.random(-2, 2);
        this.dataModel.ship.crashed = true;
    }

    tests(lastTestModifier: number): void {
        this.interactors.forEach(i => i.test(lastTestModifier));
    }

    returnState(): number {
        let s: number = undefined;
        if (this.exitState) {
            this.exitState = false;
            s = 0;
        }
        return s;
    }

}