import { DrawContext} from "ts/Common/DrawContext";
import { Assets } from "ts/Resources/Assets";
import { AmplifierSettings } from "ts/Sound/Amplifier";
import { AudioObject, AudioWithAmplifier, BufferObject } from "ts/Sound/SoundObject";
import { FXObject } from "ts/Sound/FXObject";
import { SoundEffectData } from "ts/Models/Sound/SoundEffectsModel";

import { SparseArray } from "ts/Collections/SparseArray";
import { ParticleFieldData, ParticleData, MovingParticleModel, ParticleFieldModel } from "ts/Models/ParticleFieldModel";
import { DynamicModel, ShapedModel } from "ts/Models/DynamicModels";
import { SpriteModel } from "ts/Models/Graphic/SpriteModel";
import { Rect } from "ts/DisplayObjects/DisplayObject";
import { Coordinate } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { TextData } from "ts/Models/TextModel";
import { ILocated, LocatedData  } from "ts/Data/PhysicsData";
import { TextView } from "ts/Views/TextView";
import { PolyView } from "ts/Views/PolyViews";
import { IGameState } from "ts/States/GameState";
import { IInteractor } from "ts/Interactors/Interactor"
import { Multi2ShapeCollisionDetector, Multi2MultiCollisionDetector } from "ts/Interactors/CollisionDetector";

import { Keys, KeyStateProvider } from "ts/Common/KeyStateProvider";
import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { TextObject, ValueController } from "ts/GameObjects/Common/BaseObjects";
import { SpriteObject } from "ts/GameObjects/Common/SpriteObject";
import { ParticleField } from "ts/GameObjects/Common/ParticleField";
import { AsteroidModel } from "ts/Models/Space/Asteroid";
import { BasicShip } from "ts/GameObjects/Ships/SpaceShip";
import { GraphicShip } from "ts/GameObjects/Ships/GraphicShip";
import { ISprite, HorizontalSpriteSheet } from "ts/Data/SpriteData";
import { SpriteAngledView, SpriteView } from "ts/Views/SpriteView";
import { SpriteAnimator } from "ts/Actors/SpriteAnimator"

export class Asteroid extends GameObject<AsteroidModel> { }

export class AsteroidState implements IGameState {
// data objects
// data updaters
// graphic objects
// data to graphic binders
// graphic drawers

    //player : BasicShip;
    //objects : Array<IGameObject>;
    //asteroids : Array<Asteroid>;

    interactors: IInteractor[] = [];

    asteroidNoise: boolean;
    thrustNoiseStarted: boolean;
    thrustSound: AudioObject;
    explosionSound: AudioObject;
    asteroidHitSound: AudioObject = undefined;
    laserSound: FXObject;
    helloSound: BufferObject = undefined;
    loaded: boolean;
    viewScale: number;
    zoom: number;
    zoomOrigin: Coordinate;
    exitState: boolean = false;
    level: number = 3;
    
    constructor(public name: string, private assets: Assets, private actx: AudioContext, private player: BasicShip, private objects: IGameObject[], private asteroids: Asteroid[], private score:ValueController) {
        this.viewScale = 1;
        this.zoom = 1;
        this.zoomOrigin = new Coordinate(0, 0);
        this.player = player;
        this.objects = objects;
        this.asteroids = asteroids;
        this.thrustNoiseStarted = false;
        this.asteroidNoise = false;
        this.thrustSound = new AudioObject("res/sound/thrust.wav", true);
        this.explosionSound = new AudioObject("res/sound/explosion.wav");
        var laserEffect = new SoundEffectData(
            1046.5,           //frequency
            0,                //attack
            0.3,              //decay
            "sawtooth",       //waveform
            1,                //Volume
            -0.8,             //pan
            0,                //wait before playing
            1200,             //pitch bend amount
            false,            //reverse bend
            25,               //dissonance
            [0.1, 0.2, 2000], //echo: [delay, feedback, filter]
            undefined,        //reverb: [duration, decay, reverse?]
            3);                 //Maximum duration of sound, in seconds

        this.laserSound = new FXObject(actx,
            laserEffect);
        
        // var echoEffect: AmplifierSettings = new AmplifierSettings(1, 1, 1, 0.1, 0, false, [0.3, 0.3, 2000], [1, 0.1, 0]);
        // assets.load(actx, ["res/sound/blast.wav", "res/sound/hello.wav"], () => {
        //     this.asteroidHitSound = new BufferObject(actx, assets.soundData.filter(x => x.source === "res/sound/blast.wav")[0].data);
        //     this.helloSound = new BufferObject(actx, assets.soundData.filter(x => x.source === "res/sound/hello.wav")[0].data, echoEffect);
        // });
        this.asteroidHitSound = new AudioObject("res/sound/blast.wav");
            
        var asteroidBulletDetector = new Multi2MultiCollisionDetector(this.asteroidModels.bind(this), this.bulletModels.bind(this), this.asteroidBulletHit.bind(this));
        var asteroidPlayerDetector = new Multi2ShapeCollisionDetector(this.asteroidModels.bind(this), this.player.model, this.asteroidPlayerHit.bind(this));
        this.interactors = [asteroidBulletDetector, asteroidPlayerDetector];
    }

    
    update(lastDrawModifier : number) {
        this.objects.forEach(o => o.update(lastDrawModifier));
        this.asteroids.forEach(x => x.update(lastDrawModifier));
        this.player.update(lastDrawModifier);

        // keep objects in screen
        this.asteroids.forEach(x => this.keepIn(x.model.data));
        this.keepIn(this.player.model.data);
        if (this.asteroids.length == 0) {
            this.level += 1;
            this.asteroids = AsteroidState.createLevel(this.level);
        }
    }

    private keepIn(l: ILocated) {
        if (l.location.x > 512) l.location.x = 0;
        if (l.location.x < 0) l.location.x = 512;
        if (l.location.y > 480) l.location.y = 0;
        if (l.location.y < 0) l.location.y = 480;
    }
    
    // order is important. Like layers on top of each other.
    display(drawingContext: DrawContext) {
        
        drawingContext.clear();
        drawingContext.translate(this.player.model.data.location.x * (1 - this.zoom),
            this.player.model.data.location.y * (1 - this.zoom));
        drawingContext.zoom(this.zoom, this.zoom);
        
        this.objects.forEach(o => o.display(drawingContext));
        this.asteroids.forEach(x => x.display(drawingContext));
        //drawingContext.translate(, 240
        this.player.display(drawingContext);
        drawingContext.zoom(1 / this.zoom, 1 / this.zoom);
        drawingContext.translate(-this.player.model.data.location.x * (1-this.zoom),
            -this.player.model.data.location.y * (1-this.zoom));
        
        
    }

    sound(actx: AudioContext) {
        if (this.player.model.weaponModel.fired) {
            this.laserSound.play();
            this.player.model.weaponModel.fired = false;
        }
        if (this.player.model.data.crashed && !this.player.model.data.exploded) {
            this.explosionSound.play();
            
            this.player.model.data.exploded = true;
        }

        if (this.asteroidNoise) {
            this.asteroidNoise = false;
            //if (this.helloSound !== undefined)
            //    this.helloSound.play();
            var asteroidHitSound = new AudioObject("res/sound/blast.wav");
                asteroidHitSound.play();
        }

        if (this.player.model.thrustParticleModel.data.on && !this.thrustNoiseStarted) {
            this.thrustSound.play();
            this.thrustNoiseStarted = true;
        }
        if (!this.player.model.thrustParticleModel.data.on && this.thrustNoiseStarted) {
            this.thrustSound.pause();
            this.thrustNoiseStarted = false;
        }
    }
    
    input(keys: KeyStateProvider, lastDrawModifier: number) {
        if (keys.isKeyDown(Keys.UpArrow))
            this.player.model.thrust();
        else
            this.player.model.noThrust();
        if (keys.isKeyDown(Keys.LeftArrow)) this.player.model.left(lastDrawModifier);
        if (keys.isKeyDown(Keys.RightArrow)) this.player.model.right(lastDrawModifier);
        if (keys.isKeyDown(Keys.SpaceBar)) this.player.model.shootPrimary();
        if (keys.isKeyDown(Keys.Z)) {
            this.viewScale = 0.01;
        }
        else if (keys.isKeyDown(Keys.X) && this.zoom > 1) {
            this.viewScale = -0.01;
        }
        else this.viewScale = 0;
        this.zoom *= 1 + this.viewScale;
        if (keys.isKeyDown(Keys.Esc)) this.exitState = true;
    }

    asteroidModels(): ShapedModel<ILocated>[] {
        return this.asteroids.map(a => a.model);
    }

    bulletModels(): DynamicModel<ILocated>[] {
        return this.player.model.weaponModel.particles;
        }

    asteroidBulletHit(i1: number, asteroids: AsteroidModel[], i2: number, bullets: MovingParticleModel[]) {
        // effect on asteroid
        let a = asteroids[i1];
        a.data.velX += 2;
        a.data.spin += 3;
        this.asteroidNoise = true;
        // remove bullet
        bullets.splice(i2, 1);
        // add two small asteroids
        
        this.asteroids.splice(i1, 1);
        if (a.size > 1) {
            this.asteroids.push(AsteroidState.createAsteroid(a.data.location, a.data.velX + Math.random() * 10, a.data.velY + Math.random() * 10, a.data.angle, a.data.spin + Math.random() * 10, a.size - 1));
            this.asteroids.push(AsteroidState.createAsteroid(a.data.location, a.data.velX + Math.random() * 10, a.data.velY + Math.random() * 10, a.data.angle, a.data.spin + Math.random() * 10, a.size - 1));
        }
        // TODO remove original;
        this.score.model.data.value += 10;
    }

    asteroidPlayerHit(i1: number, asteroids: AsteroidModel[], i2: number, player: Coordinate[]) {
        this.player.model.crash();
    }

    tests(lastTestModifier: number) {
        this.interactors.forEach(i => i.test(lastTestModifier));
    }

    returnState(): number {
        let s = undefined;
        if (this.exitState) {
            this.exitState = false;
            s = 0;
        }
        return s;
    }

    static createState(assets: Assets, actx: AudioContext): AsteroidState {
        //var field1 = new ParticleField('img/star.png', 512, 200, 32, 1);
        var pFieldData: ParticleFieldData = new ParticleFieldData(1);
        var pFieldModel: ParticleFieldModel = new ParticleFieldModel(pFieldData,
            (now: number) => new MovingParticleModel(new ParticleData(512 * Math.random(), 0, 0, 16, now)));
        var field: IGameObject = new ParticleField(pFieldModel, 2, 2);

        //var star: DynamicModel<ILocatedAngled> = new DynamicModel<ILocatedAngled>();
        var coinObj = AsteroidState.createCoin(new Coordinate(300, 400));

        // special
        let ship = new BasicShip(new Coordinate(256, 240), 0, 0, 0, 0);
        let asteroids = AsteroidState.createLevel(3);

        let alien: IGameObject = new GraphicShip(new Coordinate(200, 100));

        var text: IGameObject = new TextObject("SpaceCommander", new Coordinate(10, 20), "Arial", 18);
        var score: IGameObject = new TextObject("Score:", new Coordinate(400, 20), "Arial", 18);
        var valueDisplay: ValueController = new ValueController(0, new Coordinate(460, 20), "Arial", 18);

        var objects: IGameObject[] = [field, text, score, valueDisplay, alien, coinObj];

        var asteroidState = new AsteroidState("Asteroids", assets, actx, ship, objects, asteroids, valueDisplay);

        return asteroidState;
    }

    private static createLevel(level:number): Asteroid[]{
        let a: Asteroid[] = [];
        for (var i = 0; i < level; i++) {
            let asteroid = AsteroidState.createAsteroid(new Coordinate(Math.random() *512, Math.random() * 480), Math.random() * 15, Math.random() * 15, Math.random() * 360, Math.random() * 10, 3);
            a.push(asteroid);
        }
        return a;
    }

    //return Asteroid(new Coordinate(location.x, location.y), Math.random() * 5, Math.random() * 5,Math.random() * 360, Math.random() * 10);
    private static createAsteroid(location: Coordinate, velX: number, velY: number, angle: number, spin: number, size: number): Asteroid {
        let l = new Coordinate(location.x, location.y);
        var model = new AsteroidModel(l, velX, velY, angle, spin, size);
        var view: PolyView = new PolyView(model.data, model.shape);
        var asteroidObject = new Asteroid(model, [view]);
        return asteroidObject;
        
    }

    static createCoin(location: Coordinate): IGameObject {
        var l = new LocatedData(location);
        var s = new HorizontalSpriteSheet("res/img/spinningCoin.png", 46, 42, 10, 0, 0.5, 0.5);
        var a = new SpriteAnimator(s, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0.1]);
        var coinObj = new SpriteObject(l, s, [a]);
        return coinObj;
    }
   
}
