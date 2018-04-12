import { DrawContext} from "ts/Common/DrawContext";
import { Assets } from "ts/Resources/Assets";
import { AmplifierSettings } from "ts/Sound/Amplifier";
import { AudioObject, AudioWithAmplifier, BufferObject } from "ts/Sound/SoundObject";
import { SparseArray } from "ts/Collections/SparseArray";
import { IPhysical, Model, ShapedModel, GraphicModel } from "ts/Models/DynamicModels";
import { Coordinate, Vector, ICoordinate } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { TextData } from "ts/Data/TextData";
import { ILocated, LocatedData, LocatedMovingAngledRotatingData, LocatedMovingAngledRotatingForces  } from "ts/Data/PhysicsData";
import { TextView } from "ts/Views/TextView";
import { IView } from "ts/Views/View";
import { PolyView, PolyGraphic, PolyGraphicAngled, CircleView, LineView } from "ts/Views/PolyViews";
import { GraphicAngledView } from "ts/Views/GraphicView";
import { IGameState } from "ts/States/GameState";
import { IInteractor } from "ts/Interactors/Interactor"
import { Multi2ShapeCollisionDetector, Multi2FieldCollisionDetector } from "ts/Interactors/CollisionDetector";
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
import { Spinner, ISpinnerInputs, PolyRotator } from "ts/Actors/Rotators";
import { Mover, MoveConstVelocity, IMoveOut } from "ts/Actors/Movers";
import { IRodOutputs, CompositeAccelerator } from "ts/Actors/Accelerators";
import { Accelerator } from "ts/Actors/Accelerator";
import { BulletWeaponController } from "ts/Controllers/Ship/WeaponController";
import { ThrustController } from "ts/Controllers/Ship/ThrustController";
import { ExplosionController } from "ts/Controllers/Ship/ExplosionController";

export class Asteroid extends SingleGameObject<AsteroidModel> { }

export class GraphicShip extends SingleGameObject<Model<LocatedMovingAngledRotatingForces>> { }

export interface IBallObject {
    x: number;
    y: number;
    Vx: number;
    Vy: number;
    r: number;
    mass: number;
}

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

    asteroidHitSound: AudioObject = undefined;
    helloSound: BufferObject = undefined;
    loaded: boolean;
    viewScale: number;
    zoom: number;
    exitState: boolean = false;
    level: number = 3;
    ShipController: SpaceShipController;
    
    
    constructor(public name: string,
        private assets: Assets,
        private actx: AudioContext,
        private player: SpaceShipController,
        private guiObjects: IGameObject[],
        private sceneObjects: IGameObject[],
        private asteroids: Asteroid[],
        private score: ValueObject,
        private angle: ValueObject
        ) {
        this.viewScale = 1;
        this.zoom = 1;
        this.player = player;
        this.asteroids = asteroids;
        this.asteroidNoise = false;
        
        // var echoEffect: AmplifierSettings = new AmplifierSettings(1, 1, 1, 0.1, 0, false, [0.3, 0.3, 2000], [1, 0.1, 0]);
        // assets.load(actx, ["res/sound/blast.wav", "res/sound/hello.wav"], () => {
        //     this.asteroidHitSound = new BufferObject(actx, assets.soundData.filter(x => x.source === "res/sound/blast.wav")[0].data);
        //     this.helloSound = new BufferObject(actx, assets.soundData.filter(x => x.source === "res/sound/hello.wav")[0].data, echoEffect);
        // });
        this.asteroidHitSound = new AudioObject("res/sound/blast.wav");
        var asteroidBulletDetector = new Multi2FieldCollisionDetector(this.asteroidModels.bind(this),
            this.bulletModels.bind(this),
            this.player,
            this.asteroidBulletHit.bind(this));
        var asteroidPlayerDetector = new Multi2ShapeCollisionDetector(this.asteroidModels.bind(this),
            this.player.chassisObj.model,
            this.player,
            this.asteroidPlayerHit.bind(this));
        var asteroidEngineDetector = new Multi2ShapeCollisionDetector(this.asteroidModels.bind(this),
            this.player.thrustController.engine.model,
            this.player,
            this.asteroidEngineHit.bind(this));
        this.interactors = [asteroidBulletDetector, asteroidPlayerDetector, asteroidEngineDetector];
    }

    
    update(lastDrawModifier: number) {
        this.guiObjects.forEach(o => o.update(lastDrawModifier));
        this.sceneObjects.forEach(o => o.update(lastDrawModifier));
        this.asteroids.forEach(x => x.update(lastDrawModifier));

        // keep objects in screen
        this.asteroids.forEach(x => this.keepIn(x.model.physics));
        this.keepIn(this.player.chassisObj.model.physics);
        this.keepIn(this.player.thrustController.engine.model.physics);

        // If all asteroids cleared, create more at next level
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
        this.angle.model.value = this.player.chassisObj.model.physics.angle;
        this.guiObjects.forEach(o => o.display(drawingContext));
        drawingContext.save();
        let x = this.player.chassisObj.model.physics.location.x;
        let y = this.player.chassisObj.model.physics.location.y;
        drawingContext.translate(x * (1 - this.zoom), y * (1 - this.zoom));
        // move origin to location of ship - location of ship factored by zoom
        // if zoom = 1 no change
        // if zoom > 1 then drawing origin moves to -ve figures and object coordinates can start off the top left of screen
        // if zoom < 1 then drawing origin moves to +ve figires and coordinates offset closer into screen
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
            this.player.thrust();
        else
            this.player.noThrust();
        if (keys.isKeyDown(Keys.LeftArrow)) this.player.left(lastDrawModifier);
        if (keys.isKeyDown(Keys.RightArrow)) this.player.right(lastDrawModifier);
        if (keys.isKeyDown(Keys.SpaceBar)) this.player.shootPrimary();
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
        // TODO remove original;
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
        var mover = new Mover(engineSeparateModel);
        var rotator = new PolyRotator(engineSeparateModel, shapeData);
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
        let s = undefined;
        if (this.exitState) {
            this.exitState = false;
            s = 0;
        }
        return s;
    }

    static createState(assets: Assets, actx: AudioContext): AsteroidState {

        var field: IGameObject = Field.createBackgroundField(16, 2);

        // var star: DynamicModel<ILocatedAngled> = new DynamicModel<ILocatedAngled>();
        var coinObj = AsteroidState.createCoin(new Coordinate(300, 400));
        var spriteField = Field.createSpriteField();

        // special
        var spaceShipData = new SpaceShipData(new Coordinate(256, 240), 0, 0, 0, 0, 2);
        var chassisObj = ShipComponents.createShipObj(spaceShipData);
        chassisObj.model.physics.forces.push(new Vector(chassisObj.model.physics.angle, 0));

        var weaponController = BulletWeaponController.createWeaponController(chassisObj.model.physics, actx);
        var thrustController = ThrustController.createThrust(chassisObj.model.physics, chassisObj.model.shape, false);
        var explosionController = ExplosionController.createExplosion(chassisObj.model.physics, false);
        var shipController = new SpaceShipController(spaceShipData, chassisObj, weaponController, thrustController, explosionController);

        var ball = AsteroidState.createBallObject(256, 280);
        var rod: CompositeAccelerator = new CompositeAccelerator(() => {
            return {
                xFrom: chassisObj.model.physics.location.x,
                yFrom: chassisObj.model.physics.location.y,
                VxFrom: chassisObj.model.physics.velX,
                VyFrom: chassisObj.model.physics.velY,
                forces: chassisObj.model.physics.forces,
                massFrom: chassisObj.model.physics.mass,
                xTo: ball.model.x,
                yTo: ball.model.y,
                VxTo: ball.model.Vx,
                VyTo: ball.model.Vy,
                massTo: ball.model.mass
            };
        }, (out: IRodOutputs) => {
                chassisObj.model.physics.location.x += out.dxFrom;
                chassisObj.model.physics.location.y += out.dyFrom;
                chassisObj.model.physics.velX += out.dVxFrom;
                chassisObj.model.physics.velY += out.dVyFrom;
                ball.model.x = out.xTo;
                ball.model.y = out.yTo;
                // ball.model.Vx += out.dVxTo;
                // ball.model.Vy += out.dVyTo;
        });
        chassisObj.actors.push(rod);

        // create rod view as a line from ball to ship
        var line: LineView = new LineView(()=> {
            return {
                xFrom: ball.model.x,
                yFrom: ball.model.y,
                xTo: chassisObj.model.physics.location.x,
                yTo: chassisObj.model.physics.location.y,
            };
        });
        chassisObj.views.push(line);

        let asteroids: Asteroid[] = AsteroidState.createLevel(3);

        let alien: IGameObject = AsteroidState.createGraphicShip(new Coordinate(200, 100));

        var text: IGameObject = new TextObject("SpaceCommander", new Coordinate(10, 20), "Arial", 18);
        var score: IGameObject = new TextObject("Score:", new Coordinate(400, 20), "Arial", 18);
        var valueDisplay: ValueObject = new ValueObject(0, new Coordinate(460, 20), "Arial", 18);
        var angleDisplay: ValueObject = new ValueObject(chassisObj.model.physics.angle, new Coordinate(460, 40), "Arial", 18);

        var asteroidState = new AsteroidState("Asteroids", assets, actx, shipController,
            [text, score, valueDisplay, angleDisplay],
            [field, alien, coinObj, shipController, ball, spriteField],
            asteroids, valueDisplay, angleDisplay);
        return asteroidState;
    }

    private static createLevel(level:number): Asteroid[] {
        let a: Asteroid[] = [];
        for (var i = 0; i < level; i++) {
            let xy = Transforms.random(0, 3);
            let x = Transforms.random(0,512), y = Transforms.random(0, 480);
            if (xy === 0) x = Transforms.random(0, 100);
            else if (xy === 1) x = Transforms.random(412, 512);
            else if (xy === 2) y = Transforms.random(0, 100);
            else if (xy === 3) y = Transforms.random(380, 480);

            let asteroid = AsteroidState.createAsteroid(x, y, Transforms.random(-20, 20), Transforms.random(-20, 20), Transforms.random(0, 359), Transforms.random(-10, 10), 3, Transforms.random(0, 4));
            a.push(asteroid);
        }
        return a;
    }

    //return Asteroid(new Coordinate(location.x, location.y), Math.random() * 5, Math.random() * 5,Math.random() * 360, Math.random() * 10);
    public static createAsteroid(x: number, y:number, velX: number, velY: number, angle: number, spin: number, size: number, type: number): Asteroid {
        
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
        var view: IView = new PolyGraphicAngled(() => { return {
            x: model.physics.location.x,
            y: model.physics.location.y,
            shape: model.shape,
            graphic: terrain,
            angle: model.physics.angle,
        };});
        var asteroidObject: Asteroid = new Asteroid(model, [mover, spinner, rotator], [view]);
        return asteroidObject;
    }

    static createGraphicShip(location: Coordinate): GraphicShip {
        // let triangleShip = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];
        var shipModel: Model<LocatedMovingAngledRotatingForces> = new Model<LocatedMovingAngledRotatingForces>(
            new LocatedMovingAngledRotatingForces(location, 1, -1, 10, 5, 1));
        var image: IGraphic = new GraphicData("res/img/ship.png");
        var shipView: IView = new GraphicAngledView(() => { return {
            x: shipModel.physics.location.x,
            y: shipModel.physics.location.y,
            angle: shipModel.physics.angle,
            graphic: image,
        };});

        var obj: GraphicShip = new GraphicShip(shipModel, [], [shipView]);
        return obj;
    }


    static createCoin(location: Coordinate): IGameObject {
        var l = new LocatedMovingAngledRotatingData(location, 0 , 0 , 45, 4);
        var s = new HorizontalSpriteSheet("res/img/spinningCoin.png", 46, 42, 10, 0, 0.5, 0.5);
        var a = new SpriteAnimator(s, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0.1]);
        var spinner: Spinner = new Spinner(()=> {
            return { spin: l.spin };
        }, (sOut)=> l.angle += sOut.dAngle);

        var model = new GraphicModel<LocatedMovingAngledRotatingData, ISprite>(l, s);
        var view: IView = new SpriteAngledView(() => { return {
            x: model.physics.location.x,
            y: model.physics.location.y,
            angle: model.physics.angle,
            sprite: model.graphic,
        };});
        var coinObj = new SingleGameObject<GraphicModel<LocatedMovingAngledRotatingData, ISprite>>(model, [a, spinner], [view]);
        return coinObj;
    }

    static createBallObject(x: number, y: number): SingleGameObject<IBallObject> {
        var ballModel: IBallObject = {
            x: x,
            y: y,
            Vx: 0,
            Vy: 0,
            mass: 1,
            r: 8,
        };
        var ballView: IView = new CircleView(() => {
            return {
                x: ballModel.x,
                y: ballModel.y,
                r: ballModel.r,
            };
        });
        // not needed at this stage
        var mover: MoveConstVelocity = new MoveConstVelocity(
            ()=> {
                return {
                    Vx: ballModel.Vx,
                    Vy: ballModel.Vy,
                };
            }, (mOut: IMoveOut)=> {
                ballModel.x += mOut.dx;
                ballModel.y += mOut.dy;
            });
        var obj: SingleGameObject<IBallObject>  = new SingleGameObject<IBallObject>(ballModel, [mover], [ballView]);
        return obj;
    }

}
