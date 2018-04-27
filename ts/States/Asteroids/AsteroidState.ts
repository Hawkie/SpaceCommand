import { DrawContext} from "ts/Common/DrawContext";
import { Assets } from "ts/Resources/Assets";
import { AmplifierSettings } from "ts/Sound/Amplifier";
import { AudioObject, AudioWithAmplifier, BufferObject } from "ts/Sound/SoundObject";
import { SparseArray } from "ts/Collections/SparseArray";
import { Coordinate, ICoordinate } from "ts/Data/Coordinate";
import { Transforms } from "ts/Physics/Transforms";
import { TextView } from "ts/Views/TextView";
import { IView } from "ts/Views/View";
import { PolyView, PolyGraphic, PolyGraphicAngled, CircleView, LineView } from "ts/Views/PolyViews";
import { GraphicAngledView } from "ts/Views/GraphicView";
import { IGameState } from "ts/States/GameState";
import { IInteractor } from "ts/Interactors/Interactor";
import { Multi2ShapeCollisionDetector, Multi2FieldCollisionDetector } from "ts/Interactors/CollisionDetector";
import { Keys, KeyStateProvider } from "ts/Common/KeyStateProvider";
import { IGameObject, SingleGameObject, MultiGameObject, IObject, ComponentObjects } from "ts/GameObjects/GameObject";
import { Field, IThrustInputs } from "ts/States/Asteroids/ParticleField";
import { ISprite, HorizontalSpriteSheet } from "ts/Data/Sprite";
import { Graphic, IGraphic } from "ts/Data/Graphic";
import { Shape, IShape } from "ts/Data/Shape";
import { SpriteAngledView, SpriteView } from "ts/Views/SpriteView";
import { SpriteAnimator } from "ts/Actors/SpriteAnimator";
import { Spinner, ISpinnerInputs, PolyRotator } from "ts/Actors/Rotators";
import { MoveConstVelocity, IMoveOut } from "ts/Actors/Movers";
import { IRodOutputs, CompositeAccelerator } from "ts/Actors/Accelerators";
import { Accelerator } from "ts/Actors/Accelerator";
import { IActor } from "../../Actors/Actor";
import { IShip, AsteroidModels, IBall, IAsteroid, IGraphicShip, ICoin, IAsteroidState, createStateModel } from "./AsteroidModels";
import { AsteroidObjects, IAsteroidStateObject, createAsteroidStateObject } from "./AsteroidObjects";
import { ArrayAmender } from "ts/States/Asteroids/AsteroidField";


export class AsteroidState implements IGameState {
    interactors: IInteractor[] = [];
    loaded: boolean;
    viewScale: number;
    zoom: number;
    exitState: boolean = false;

    constructor(public name: string,
        private assets: Assets,
        private actx: AudioContext,
        private state: IAsteroidState,
        private stateObj: IAsteroidStateObject,
        private sceneObjects: IGameObject[]
        ) {
        this.viewScale = 1;
        this.zoom = 1;
        var asteroidBulletDetector: IInteractor = new Multi2FieldCollisionDetector(()=>
            this.state.asteroids.asteroids.map((a)=> { return {
                location: {x: a.x, y: a.y},
                shape: a.shape,
            };}),
            ()=> this.state.ship.weapon1.bullets.map((b)=> { return {
                x: b.x,
                y: b.y,
            };}),
            this.bulletHitAsteroid.bind(this));
        var asteroidPlayerDetector:IInteractor = new Multi2ShapeCollisionDetector(()=>
            this.state.asteroids.asteroids.map((a)=> { return {
                location: {x: a.x, y: a.y},
                shape: a.shape,
            };}),
            ()=> { return {
                location: {x: this.state.ship.x, y: this.state.ship.y },
                shape: this.state.ship.shape,
            };},
            this.asteroidPlayerHit.bind(this));
        this.interactors = [asteroidBulletDetector, asteroidPlayerDetector];
    }


    static createState(assets: Assets, actx: AudioContext): AsteroidState {

        var field: IGameObject = Field.createBackgroundField(16, 2);
        var spriteField: IGameObject = Field.createSpriteField();
        var state: IAsteroidState = createStateModel();
        var stateObj: IAsteroidStateObject = createAsteroidStateObject(()=>state);
        // get state objects and add asteroid objects

        var asteroidState: AsteroidState = new AsteroidState("Asteroids", assets, actx, state, stateObj,
            [field, spriteField]);
        return asteroidState;
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
        let x: number  = this.state.ship.x;
        let y: number = this.state.ship.y;
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
            this.state.up = true;
        } else {
            this.state.up = false;
        }
        if (keys.isKeyDown(Keys.LeftArrow)) {
            this.state.left = true;
        } else {
            this.state.left = false;
        }
        if (keys.isKeyDown(Keys.RightArrow)) {
            this.state.right = true;
        } else {
            this.state.right = false;
        }
        if (keys.isKeyDown(Keys.SpaceBar)) {
            this.state.fire = true;
        } else {
            this.state.fire = false;
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
        let a:IAsteroid = this.state.asteroids.asteroids[i1];
        // this.asteroidNoise = true;
        // remove bullet - todo - remove bullet with function
        this.state.ship.weapon1.bullets.splice(i2, 1);
        this.stateObj.weaponObj.getComponents().splice(i2, 1);
        // todo remove bullet obj

        // add two small asteroids
        this.state.asteroids.break = true;
        this.state.asteroids.asteroids.splice(i1, 1);
        this.stateObj.asteroidObjs.getComponents().splice(i1, 1);
        // arrayAmender<IAsteroid>(;
        if (a.size > 1) {
            for (let n:number = 0; n < 2; n++) {
                var newAsteroid:IAsteroid = AsteroidModels.createAsteroidModelAt(a.x, a.y, a.Vx, a.Vy, a.size - 1);
                this.state.asteroids.asteroids.push(newAsteroid);
                var asteroidObj: SingleGameObject<IAsteroid> = AsteroidObjects.createAsteroidObject(()=>newAsteroid);
                this.stateObj.asteroidObjs.getComponents().push(asteroidObj);
            }
        }
        this.state.score += 10;

        // if all asteroids cleared, create more at next level
        if (this.state.asteroids.asteroids.length === 0) {
            this.state.score += 50;
            this.state.level += 1;
            // how do we ensure new asteroid objects bound to the new models in the state
            this.state.asteroids.asteroids = AsteroidModels.createAsteroidModels(this.state.level);
            for (let n:number = 0; n < this.state.asteroids.asteroids.length; n++) {
                let a:IAsteroid = this.state.asteroids.asteroids[n];
                let asteroidObj: SingleGameObject<IAsteroid> = AsteroidObjects.createAsteroidObject(()=>a);
                this.stateObj.asteroidObjs.getComponents().push(asteroidObj);
            }
        }
    }

    asteroidPlayerHit(i1: number, i2: number): void {
        var a: IAsteroid = this.state.asteroids.asteroids[i1];
        var xImpact: number = a.Vx;
        var yImpact: number = a.Vy;
        this.state.ship.Vx = xImpact + Transforms.random(-2, 2);
        this.state.ship.Vy = yImpact + Transforms.random(-2, 2);
        this.state.ship.crashed = true;
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
