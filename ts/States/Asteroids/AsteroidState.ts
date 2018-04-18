import { DrawContext} from "ts/Common/DrawContext";
import { Assets } from "ts/Resources/Assets";
import { AmplifierSettings } from "ts/Sound/Amplifier";
import { AudioObject, AudioWithAmplifier, BufferObject } from "ts/Sound/SoundObject";
import { SparseArray } from "ts/Collections/SparseArray";
import { IPhysical, ShapedModel } from "ts/Models/DynamicModels";
import { Coordinate, Vector, ICoordinate } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { TextData } from "ts/Data/TextData";
import { ILocated, LocatedData, LocatedMovingAngledRotatingData, LocatedMovingAngledRotatingForces  } from "ts/Data/PhysicsData";
import { TextView } from "ts/Views/TextView";
import { IView } from "ts/Views/View";
import { PolyView, PolyGraphic, PolyGraphicAngled, CircleView, LineView } from "ts/Views/PolyViews";
import { GraphicAngledView } from "ts/Views/GraphicView";
import { IGameState } from "ts/States/GameState";
import { IInteractor } from "ts/Interactors/Interactor";
import { Multi2ShapeCollisionDetector, Multi2FieldCollisionDetector } from "ts/Interactors/CollisionDetector";
// import { SpaceShipData } from "ts/Data/ShipData";
// import { ShipComponents, IShip } from "ts/Controllers/Ship/ShipComponents";
import { SpaceShipController } from "ts/Controllers/Ship/ShipController";
import { Keys, KeyStateProvider } from "ts/Common/KeyStateProvider";
import { IGameObject, SingleGameObject, MultiGameObject, IObject } from "ts/GameObjects/GameObject";
import { TextObject } from "ts/GameObjects/TextObject";
import { ValueObject } from "ts/GameObjects/ValueObject";
import { Field, IThrustInputs } from "ts/GameObjects/ParticleField";
import { AsteroidModel } from "ts/States/Asteroids/AsteroidModel";
import { ISprite, HorizontalSpriteSheet } from "ts/Data/SpriteData";
import { GraphicData, IGraphic } from "ts/Data/GraphicData";
import { ShapeData, IShape } from "ts/Data/ShapeData";
import { SpriteAngledView, SpriteView } from "ts/Views/SpriteView";
import { SpriteAnimator } from "ts/Actors/SpriteAnimator";
import { Spinner, ISpinnerInputs, PolyRotator } from "ts/Actors/Rotators";
import { MoveConstVelocity, IMoveOut } from "ts/Actors/Movers";
import { IRodOutputs, CompositeAccelerator } from "ts/Actors/Accelerators";
import { Accelerator } from "ts/Actors/Accelerator";
import { WeaponController, IWeaponController } from "ts/Controllers/Ship/WeaponController";
import { ThrustController, IThrustController } from "ts/Controllers/Ship/ThrustController";
import { ExplosionController, IExplosionController } from "ts/Controllers/Ship/ExplosionController";
import { IActor } from "../../Actors/Actor";
import { IShip, AsteroidModels, IBall, IAsteroid, IGraphicShip, ICoin, IAsteroidState } from "./AsteroidModels";
import { AsteroidObjects } from "./AsteroidObjects";


export class AsteroidState implements IGameState {
// data objects
// data updaters
// graphic objects
// data to graphic binders
// graphic drawers


    interactors: IInteractor[] = [];

    asteroidNoise: boolean;
    asteroidHitSound: AudioObject = undefined;
    helloSound: BufferObject = undefined;
    loaded: boolean;
    viewScale: number;
    zoom: number;
    exitState: boolean = false;

    constructor(public name: string,
        private assets: Assets,
        private actx: AudioContext,
        private state: IAsteroidState,
        private stateObj: MultiGameObject<IAsteroidState, IGameObject>,
        private sceneObjects: IGameObject[]
        ) {
        this.viewScale = 1;
        this.zoom = 1;
        this.asteroidNoise = false;

        // var echoEffect: AmplifierSettings = new AmplifierSettings(1, 1, 1, 0.1, 0, false, [0.3, 0.3, 2000], [1, 0.1, 0]);
        // assets.load(actx, ["res/sound/blast.wav", "res/sound/hello.wav"], () => {
        //     this.asteroidHitSound = new BufferObject(actx, assets.soundData.filter(x => x.source === "res/sound/blast.wav")[0].data);
        //     this.helloSound = new BufferObject(actx, assets.soundData.filter(x => x.source === "res/sound/hello.wav")[0].data, echoEffect);
        // });
        this.asteroidHitSound = new AudioObject("res/sound/blast.wav");
        var asteroidBulletDetector = new Multi2FieldCollisionDetector(this.asteroidModels.bind(this),
            this.bulletModels.bind(this),
            this.state.ship,
            this.asteroidBulletHit.bind(this));
        var asteroidPlayerDetector = new Multi2ShapeCollisionDetector(this.asteroidModels.bind(this),
            this.player.chassisObj.model,
            this.player,
            this.asteroidPlayerHit.bind(this));
        // var asteroidEngineDetector = new Multi2ShapeCollisionDetector(this.asteroidModels.bind(this),
        //     this.player.thrustController.engine.model,
        //     this.player,
        //     this.asteroidEngineHit.bind(this));
        this.interactors = [asteroidBulletDetector, asteroidPlayerDetector];
    }



    static createState(assets: Assets, actx: AudioContext): AsteroidState {

        var field: IGameObject = Field.createBackgroundField(16, 2);
        var spriteField: IGameObject = Field.createSpriteField();

        var state: IAsteroidState = AsteroidModels.createStateModel();
        var stateObj: MultiGameObject<IAsteroidState, IGameObject> = AsteroidObjects.createAsteroidStateObject(()=>state);

        var asteroidState: AsteroidState = new AsteroidState("Asteroids", assets, actx, state, stateObj,
            [field, spriteField]);
        return asteroidState;
    }

    update(lastDrawModifier: number): void {
        this.sceneObjects.forEach(o => o.update(lastDrawModifier));
        this.stateObj.update(lastDrawModifier);

        // keep objects in screen. move to an actor!
        this.keepIn(this.state.ship.x, 0, 512, (newV: number)=> { this.state.ship.x = newV; });
        this.keepIn(this.state.ship.y, 0, 480, (newV: number)=> { this.state.ship.y = newV; });

        // if all asteroids cleared, create more at next level
        if (this.state.asteroids.length === 0) {
            this.state.level += 1;
            // how do we ensure new asteroid objects bound to the new models in the state
            this.state.asteroids = AsteroidModels.createAsteroidModels(this.state.level);
        }
    }

    private keepIn(value: number, lowLimit:number, upLimit: number, f:(newV: number)=> void): void {
        if (value > upLimit) { f(lowLimit);}
        if (value < lowLimit) { f(upLimit);}
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
        this.stateObj.display(drawingContext);
        drawingContext.restore();
    }

    sound(actx: AudioContext) {

        if (this.asteroidNoise) {
            this.asteroidNoise = false;
            // if (this.helloSound !== undefined)
            //    this.helloSound.play();
            var asteroidHitSound = new AudioObject("res/sound/blast.wav");
                asteroidHitSound.play();
        }
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

    asteroidModels(): ShapedModel<ILocated, IShape>[] {
        return this.asteroids.map(a => a.model);
    }

    bulletModels(): ICoordinate[] {
        return this.player.weaponController.bullets;
    }

    asteroidBulletHit(i1: number, asteroids: AsteroidModel[], i2: number, bullets: ICoordinate[], tag:any) {
        // effect on asteroid
        let a = asteroids[i1];
        a.physics.velX += 2;
        a.physics.spin += 3;
        this.asteroidNoise = true;
        // remove bullet - todo - remove bullet with function
        this.player.weaponController.bulletField.components.splice(i2, 1);
        // add two small asteroids

        this.asteroids.splice(i1, 1);
        if (a.size > 1) {
            for (let n:number = 0; n < 2; n++) {
                this.asteroids.push(AsteroidState.createAsteroid(a.physics.location.x,
                    a.physics.location.y,
                    a.physics.velX + Math.random() * 10,
                    a.physics.velY + Math.random() * 10,
                    Transforms.random(0, 359),
                    a.physics.spin + Math.random() * 10,
                    a.size - 1,
                    Transforms.random(0, 4)));
            }
        }
        // tODO remove original;
        this.score.model.value += 10;
    }

    asteroidPlayerHit(i1: number, asteroids: AsteroidModel[], i2: number, playerx: Coordinate[], player: SpaceShipController) {
        var a = asteroids[i1];
        var xImpact = a.physics.velX;
        var yImpact = a.physics.velY;
        player.chassisObj.model.physics.velX = xImpact + Transforms.random(-2, 2);
        player.chassisObj.model.physics.velY = yImpact + Transforms.random(-2, 2);
        player.crash();
    }

    asteroidEngineHit(i1: number, asteroids: AsteroidModel[], i2: number, playerx: Coordinate[], player: SpaceShipController) {
        var a = asteroids[i1];
        var xImpact = a.physics.velX;
        var yImpact = a.physics.velY;
        var engineSeparateModel = new LocatedMovingAngledRotatingForces(new Coordinate(player.chassisObj.model.physics.location.x,
            player.chassisObj.model.physics.location.y),
            xImpact + Transforms.random(-2, 2),
            yImpact + Transforms.random(-2, 2),
            player.chassisObj.model.physics.angle,
            5, 0.5);
        var shapeData = this.player.thrustController.engine.model.shape;
        var mover: IActor = new MoveConstVelocity(() => { return {
            Vx: engineSeparateModel.velX,
            Vy: engineSeparateModel.velY,
        };}, (out: IMoveOut) => {
                engineSeparateModel.location.x += out.dx;
                engineSeparateModel.location.y += out.dy;
            }
        );
        var rotator: IActor = new PolyRotator(() => { return {
            angle: engineSeparateModel.angle,
            shape: this.player.thrustController.engine.model.shape,
        };}, (out: IShape)=> {
            this.player.thrustController.engine.model.shape = out;
        });
        var spinner: Spinner  = new Spinner(() => {
            return { spin:engineSeparateModel.spin };
        }, (sOut)=> engineSeparateModel.angle += sOut.dAngle);
        player.thrustController.engine.model.physics = engineSeparateModel;
        player.thrustController.engine.actors = [mover, rotator, spinner];
        var view: IView = new PolyView(() => { return {
            x: engineSeparateModel.location.x,
            y: engineSeparateModel.location.y,
            shape: shapeData,
        };});
        player.thrustController.engine.views = [view];
    }

    tests(lastTestModifier: number) {
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
