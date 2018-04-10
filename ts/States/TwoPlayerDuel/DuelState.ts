import { DrawContext} from "ts/Common/DrawContext";
import { Assets } from "ts/Resources/Assets";
import { AmplifierSettings } from "ts/Sound/Amplifier";
import { AudioObject, AudioWithAmplifier, BufferObject } from "ts/Sound/SoundObject";
import { SparseArray } from "ts/Collections/SparseArray";
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
import { IPhysical, Model, ShapedModel, GraphicModel } from "ts/Models/DynamicModels";
import { Coordinate, Vector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { TextData } from "ts/Data/TextData";
import { ILocated, LocatedData, LocatedMovingAngledRotatingData, LocatedMovingAngledRotatingForces  } from "ts/Data/PhysicsData";
import { TextView } from "ts/Views/TextView";
import { IView } from "ts/Views/View";
import { PolyView, PolyGraphic, PolyGraphicAngled } from "ts/Views/PolyViews";
import { GraphicAngledView } from "ts/Views/GraphicView";
import { IGameState, GameState } from "ts/States/GameState";
import { IInteractor } from "ts/Interactors/Interactor"
import { ObjectCollisionDetector, Multi2ShapeCollisionDetector, Multi2FieldCollisionDetector } from "ts/Interactors/CollisionDetector";
import { SpaceShipData } from "ts/Data/ShipData";
import { ShipComponents } from "ts/Controllers/Ship/ShipComponents";
import { SpaceShipController } from "ts/Controllers/Ship/ShipController";
import { Keys, KeyStateProvider } from "ts/Common/KeyStateProvider";
import { IGameObject, SingleGameObject, MultiGameObject } from "ts/GameObjects/GameObject";
import { TextObject } from "ts/GameObjects/TextObject";
import { ValueObject } from "ts/GameObjects/ValueObject";
import { Field } from "ts/GameObjects/ParticleField";
import { AsteroidModel } from "ts/States/Asteroids/AsteroidModel";
import { ISprite, HorizontalSpriteSheet } from "ts/Data/SpriteData";
import { GraphicData, IGraphic } from "ts/Data/GraphicData";
import { ShapeData, IShape } from "ts/Data/ShapeData";
import { SpriteAngledView, SpriteView } from "ts/Views/SpriteView";
import { SpriteAnimator } from "ts/Actors/SpriteAnimator";
import { Spinner, PolyRotator } from "ts/Actors/Rotators";
import { Mover } from "ts/Actors/Movers";
import { IAcceleratorInputs, IAcceleratorOutputs, Accelerator } from "ts/Actors/Accelerator";
import { BulletWeaponController } from "ts/Controllers/Ship/WeaponController";
import { ThrustController } from "ts/Controllers/Ship/ThrustController";
import { ExplosionController } from "ts/Controllers/Ship/ExplosionController";

export class Asteroid extends SingleGameObject<AsteroidModel> { }

export class GraphicShip extends SingleGameObject<Model<LocatedMovingAngledRotatingForces>> { }

export class DuelState extends GameState implements IGameState {
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

    asteroidHitSound: AudioObject = undefined;
    helloSound: BufferObject = undefined;
    loaded: boolean;
    viewScale: number;
    zoom: number;
    exitState: boolean = false;
    level: number = 3;
    ShipController: SpaceShipController;

    width: number = 512;
    height: number = 480;

    constructor(
        name: string,
        private assets: Assets,
        private actx: AudioContext,
        private players: SpaceShipController[],
        private guiObjects: IGameObject[],
        private sceneObjects: IGameObject[],
        private asteroids: Asteroid[],
        private score: ValueObject
    ) {
        super(name);
        this.viewScale = 1;
        this.zoom = 1;
        this.players = players;
        this.asteroids = asteroids;
        this.asteroidNoise = false;

        // var echoEffect: AmplifierSettings = new AmplifierSettings(1, 1, 1, 0.1, 0, false, [0.3, 0.3, 2000], [1, 0.1, 0]);
        // assets.load(actx, ["res/sound/blast.wav", "res/sound/hello.wav"], () => {
        //     this.asteroidHitSound = new BufferObject(actx, assets.soundData.filter(x => x.source === "res/sound/blast.wav")[0].data);
        //     this.helloSound = new BufferObject(actx, assets.soundData.filter(x => x.source === "res/sound/hello.wav")[0].data, echoEffect);
        // });
        this.asteroidHitSound = new AudioObject("res/sound/blast.wav");

        
        this.interactors = [];

        this.players.forEach(player => {
            var asteroidBulletDetector = new Multi2FieldCollisionDetector(this.asteroidModels.bind(this), () => player.weaponController.bullets, player, this.asteroidBulletHit.bind(this));
            this.interactors.push(asteroidBulletDetector);
            var asteroidPlayerDetector = new Multi2ShapeCollisionDetector(this.asteroidModels.bind(this), player.chassisObj.model, player, this.asteroidPlayerHit.bind(this));
            this.interactors.push(asteroidPlayerDetector);
            var asteroidEngineDetector = new Multi2ShapeCollisionDetector(this.asteroidModels.bind(this), player.thrustController.engine.model, player, this.asteroidEngineHit.bind(this));
            this.interactors.push(asteroidEngineDetector);    
        });
        var player1ShootPlayer2Detector = new Multi2FieldCollisionDetector(() => [this.players[0].chassisObj.model], () => this.players[1].weaponController.bullets, this.players[0], this.playerHitPlayer.bind(this));
        this.interactors.push(player1ShootPlayer2Detector);
        var player2ShootPlayer1Detector = new Multi2FieldCollisionDetector(() => [this.players[1].chassisObj.model], () => this.players[0].weaponController.bullets, this.players[1], this.playerHitPlayer.bind(this));
        this.interactors.push(player2ShootPlayer1Detector) 
    }


    update(lastDrawModifier: number) {
        this.guiObjects.forEach(o => o.update(lastDrawModifier));
        this.sceneObjects.forEach(o => o.update(lastDrawModifier));
        this.asteroids.forEach(x => x.update(lastDrawModifier));

        // keep objects in screen
        this.asteroids.forEach(x => this.keepIn(x.model.physics));
        this.players.forEach(player => {
            // reset zoom if wrap around screen
            if (this.keepIn(player.chassisObj.model.physics) > 0) this.zoom = 1;
            this.keepIn(player.thrustController.engine.model.physics);
        });

        // If all asteroids cleared, create more at next level
        if (this.asteroids.length == 0) {
            this.level += 1;
            this.asteroids = DuelState.createLevel(this.level);
        }
    }

    private keepIn(l: ILocated): number {
        let moved = 0;
        if (l.location.x > this.width) { l.location.x = 0; moved = 1; }
        if (l.location.x < 0) { l.location.x = this.width; moved = 2; } 
        if (l.location.y > this.height) { l.location.y = 0; moved = 3; }
        if (l.location.y < 0) { l.location.y = this.height; moved = 4; }
        return moved;
    }

    // order is important. Like layers on top of each other.
    display(drawingContext: DrawContext) {

        drawingContext.clear();
        this.guiObjects.forEach(o => o.display(drawingContext));
        drawingContext.save();
    
        let x1 = Math.min(this.players[0].chassisObj.model.physics.location.x,
            this.players[1].chassisObj.model.physics.location.x);
        let x2 = Math.max(this.players[0].chassisObj.model.physics.location.x,
            this.players[1].chassisObj.model.physics.location.x);
        let xd = (x2 - x1);
        let midX = x1 + (xd * 0.5);

        let y1 = Math.min(this.players[0].chassisObj.model.physics.location.y,
            this.players[1].chassisObj.model.physics.location.y);
        let y2 = Math.max(this.players[0].chassisObj.model.physics.location.y,
            this.players[1].chassisObj.model.physics.location.y);
        let yd = (y2 - y1);
        let midY = y1 + (yd * 0.5);
        //let d = Math.sqrt(Math.pow(xd, 2) + Math.pow(yd, 2));
        //this.zoom = 351 / d;
        let lx = midX * (1 -this.zoom); // origin doesn't change unless zoomed (then to mid point of ships)
        let uy = midY * (1 -this.zoom);
        //let lx = 256 - midX * this.zoom; // interesting: origin is always mid point between ships
        //let uy = 256 - midY * this.zoom;
        //if ((xd -20) * this.zoom > 256 * this.zoom
        //    || (yd - 20) * this.zoom > 240 * this.zoom) this.zoom *= 0.99;
        drawingContext.translate(lx, uy);
        drawingContext.zoom(this.zoom, this.zoom);
        this.sceneObjects.forEach(o => o.display(drawingContext));
        this.asteroids.forEach(x => x.display(drawingContext));
        drawingContext.restore();
    }

    sound(actx: AudioContext) {

        if (this.asteroidNoise) {
            this.asteroidNoise = false;
            //if (this.helloSound !== undefined)
            //    this.helloSound.play();
            var asteroidHitSound = new AudioObject("res/sound/blast.wav");
            asteroidHitSound.play();
        }
    }

    input(keys: KeyStateProvider, lastDrawModifier: number) {
        if (keys.isKeyDown(Keys.UpArrow))
            this.players[0].thrust();
        else
            this.players[0].noThrust();
        if (keys.isKeyDown(Keys.LeftArrow)) this.players[0].left(lastDrawModifier);
        if (keys.isKeyDown(Keys.RightArrow)) this.players[0].right(lastDrawModifier);
        if (keys.isKeyDown(Keys.SpaceBar)) this.players[0].shootPrimary();

        if (keys.isKeyDown(Keys.W))
            this.players[1].thrust();
        else
            this.players[1].noThrust();
        if (keys.isKeyDown(Keys.A)) this.players[1].left(lastDrawModifier);
        if (keys.isKeyDown(Keys.D)) this.players[1].right(lastDrawModifier);
        if (keys.isKeyDown(Keys.Q)) this.players[1].shootPrimary();

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

    asteroidModels(): ShapedModel<ILocated, IShape>[] {
        return this.asteroids.map(a => a.model);
    }

    //bulletModels(): SingleGameObject<ILocated>[] {
    //    return this.players[0].weaponController.bullets.concat(this.players[1].weaponController.bullets);
    //}

    playerHitPlayer(i1: number, players: ShapedModel<SpaceShipData, ShapeData>[], i2: number, bullets: SingleGameObject<ILocated>[], playerHit: SpaceShipController) {
        // remove bullet
        bullets.splice(i2, 1);

        playerHit.crash();
    }

    asteroidBulletHit(i1: number, asteroids: AsteroidModel[], i2: number, bullets: SingleGameObject<ILocated>[], tag:any) {
        // effect on asteroid
        let a = asteroids[i1];
        a.physics.velX += 2;
        a.physics.spin += 3;
        this.asteroidNoise = true;
        // remove bullet
        bullets.splice(i2, 1);
        // add two small asteroids

        this.asteroids.splice(i1, 1);
        if (a.size > 1) {
            for (let n = 0; n < 2; n++) {
                this.asteroids.push(DuelState.createAsteroid(a.physics.location.x, a.physics.location.y, a.physics.velX + Math.random() * 10, a.physics.velY + Math.random() * 10, Transforms.random(0, 359), a.physics.spin + Math.random() * 10, a.size - 1, Transforms.random(0, 4)));
            }
        }
        // TODO remove original;
        this.score.model.value += 10;
    }

    asteroidPlayerHit(i1: number, asteroids: AsteroidModel[], i2: number, playerc: Coordinate[], player:SpaceShipController) {
        var a = asteroids[i1];
        var xImpact = a.physics.velX;
        var yImpact = a.physics.velY;
        player.chassisObj.model.physics.velX = xImpact + Transforms.random(-2, 2);
        player.chassisObj.model.physics.velY = yImpact + Transforms.random(-2, 2);
        player.crash();
    }

    asteroidEngineHit(i1: number, asteroids: AsteroidModel[], i2: number, playerx: Coordinate[], player:SpaceShipController) {
        var a = asteroids[i1];
        var xImpact = a.physics.velX;
        var yImpact = a.physics.velY;
        var engineSeparateModel = new LocatedMovingAngledRotatingForces(new Coordinate(player.chassisObj.model.physics.location.x,
            player.chassisObj.model.physics.location.y),
            xImpact + Transforms.random(-2, 2),
            yImpact + Transforms.random(-2, 2),
            player.chassisObj.model.physics.angle,
            5,
            0.5);
        var shapeData = player.thrustController.engine.model.shape;
        var mover = new Mover(engineSeparateModel);
        var rotator = new PolyRotator(engineSeparateModel, shapeData);
        var spinner: Spinner = new Spinner(() => {
            return {spin: engineSeparateModel.spin};
        }, (sOut)=> engineSeparateModel.angle += sOut.dAngle);
        player.thrustController.engine.model.physics = engineSeparateModel;
        player.thrustController.engine.actors = [mover, rotator, spinner];
        var view = new PolyView(engineSeparateModel, shapeData);
        player.thrustController.engine.views = [view];
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

    static createPlayer(location: Coordinate, angle:number, actx: AudioContext): SpaceShipController {
        var shipData = new SpaceShipData(location, 0, 0, angle, 0, 1);
        var chassisObj = ShipComponents.createShipObj(shipData);
        chassisObj.model.physics.forces.push(new Vector(chassisObj.model.physics.angle, 0));
        var getAcceleratorProps: () => IAcceleratorInputs = () => {
            return {
                x: chassisObj.model.physics.location.x,
                y:chassisObj.model.physics.location.y,
                Vx:chassisObj.model.physics.velX,
                Vy:chassisObj.model.physics.velY,
                forces:chassisObj.model.physics.forces,
                mass:chassisObj.model.physics.mass
            };
        };
        var accelerator = new Accelerator(getAcceleratorProps, (out: IAcceleratorOutputs)=> {
            chassisObj.model.physics.velX += out.dVx;
            chassisObj.model.physics.velY += out.dVy;
        });
        chassisObj.actors.push(accelerator);

        var weaponController1 = BulletWeaponController.createWeaponController(chassisObj.model.physics, actx);
        var thrustController1 = ThrustController.createSpaceThrust(chassisObj.model.physics, chassisObj.model.shape);
        var explosionController1 = ExplosionController.createExplosion(chassisObj.model.physics, false);
        var shipController1 = new SpaceShipController(shipData, chassisObj, weaponController1, thrustController1, explosionController1);
        return shipController1;
    }

    static createState(assets: Assets, actx: AudioContext): DuelState {

        var field: IGameObject = Field.createBackgroundField(16, 2);

        //var star: DynamicModel<ILocatedAngled> = new DynamicModel<ILocatedAngled>();
        //var spriteField = Field.createSpriteField();

        // special
        let player1 = DuelState.createPlayer(new Coordinate(394, 120), 180, actx);
        player1.update(0);
        let player2 = DuelState.createPlayer(new Coordinate(128, 360), 0, actx);
        
        let asteroids = DuelState.createLevel(3);

        let alien: IGameObject = DuelState.createGraphicShip(new Coordinate(200, 100));

        var text: IGameObject = new TextObject("SpaceCommander", new Coordinate(10, 20), "Arial", 18);
        var score: IGameObject = new TextObject("Score:", new Coordinate(400, 20), "Arial", 18);
        var valueDisplay: ValueObject = new ValueObject(0, new Coordinate(460, 20), "Arial", 18);

        var asteroidState = new DuelState("Duel", assets, actx, [player1, player2], [text, score, valueDisplay], [field, alien, player1, player2], asteroids, valueDisplay);
        return asteroidState;
    }

    private static createLevel(level: number): Asteroid[] {
        let a: Asteroid[] = [];
        for (var i = 0; i < level; i++) {
            let xy = Transforms.random(0, 3);
            let x = Transforms.random(0, 512), y = Transforms.random(0, 480);
            if (xy === 0) x = Transforms.random(0, 100);
            else if (xy === 1) x = Transforms.random(412, 512);
            else if (xy === 2) y = Transforms.random(0, 100);
            else if (xy === 3) y = Transforms.random(380, 480);

            let asteroid = DuelState.createAsteroid(x, y, Transforms.random(-20, 20), Transforms.random(-20, 20), Transforms.random(0, 359), Transforms.random(-10, 10), 3, Transforms.random(0, 4));
            a.push(asteroid);
        }
        return a;
    }

    //return Asteroid(new Coordinate(location.x, location.y), Math.random() * 5, Math.random() * 5,Math.random() * 360, Math.random() * 10);
    private static createAsteroid(x: number, y: number, velX: number, velY: number, angle: number, spin: number, size: number, type: number): Asteroid {

        //var rectangle1 = [new Coordinate(- 2, -20),
        //    new Coordinate(2, -20),
        //    new Coordinate(2, 20),
        //    new Coordinate(-2, 20),
        //    new Coordinate(-2, -20)];
        let l = new Coordinate(x, y);
        var model = new AsteroidModel(l, velX, velY, angle, spin, size, type);
        //var view: PolyView = new PolyView(model.data, model.shape);
        var terrain = new GraphicData("res/img/terrain.png");
        var mover = new Mover(model.physics);
        var spinner: Spinner = new Spinner(() => {
            return { spin: model.physics.spin };
        }, (sOut)=> model.physics.angle += sOut.dAngle);
        var rotator = new PolyRotator(model.physics, model.shape);
        var view: PolyGraphicAngled = new PolyGraphicAngled(model.physics, model.shape, terrain);
        var asteroidObject = new Asteroid(model, [mover, spinner, rotator], [view]);
        return asteroidObject;
    }

    static createGraphicShip(location: Coordinate): GraphicShip {

        //let triangleShip = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];
        var shipModel: Model<LocatedMovingAngledRotatingForces> = new Model<LocatedMovingAngledRotatingForces>(new LocatedMovingAngledRotatingForces(location, 1, -1, 10, 5, 0.8));
        var shipView: IView = new GraphicAngledView(shipModel.physics, new GraphicData("res/img/ship.png"));

        //var thrustView: ParticleFieldView = new ParticleFieldView(shipModel.thrustParticleModel.data, 1, 1);
        //var explosionView: ParticleFieldView = new ParticleFieldView(shipModel.explosionParticleModel.data, 3, 3);

        var obj = new GraphicShip(shipModel, [], [shipView]);
        return obj;
    }
}
