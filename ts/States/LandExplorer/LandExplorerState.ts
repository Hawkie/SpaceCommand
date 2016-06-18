import { DrawContext} from "ts/Common/DrawContext";
import { Assets } from "ts/Resources/Assets";
import { AudioObject } from "ts/Sound/SoundObject";

import { Coordinate, Vector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { Keys, KeyStateProvider } from "ts/Common/KeyStateProvider";
import { IGameState } from "ts/States/GameState";
import { SparseArray } from "ts/Collections/SparseArray";

import { ILocated, LocatedData } from "ts/Data/PhysicsData";
import { ShapeData } from "ts/Data/ShapeData";
import { Direction } from "ts/Data/WindData";
import { PlanetSurfaceModel } from "ts/States/Land/PlanetSurface";
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { IParticleFieldData, ParticleFieldData } from "ts/Data/ParticleFieldData";
import { ParticleModel, ParticleFieldModel } from "ts/Models/ParticleFieldModel";
import { DynamicModel, ShapedModel } from "ts/Models/DynamicModels";
import { WindModel } from "ts/States/Land/WindModel";
import { LandingPadModel } from "ts/States/Land/LandingPad";
import { LandingShipModel } from "ts/States/Land/LandingShip";
import { BasicShipModel } from "ts/States/Asteroids/SpaceShipModel";

import { IInteractor, Interactor } from "ts/Interactors/Interactor";
import { ObjectCollisionDetector } from "ts/Interactors/CollisionDetector";

import { IGameObject, GameObject } from "ts/GameObjects/GameObject"
import { TextObject } from "ts/GameObjects/TextObject";
import { ParticleField } from "ts/GameObjects/ParticleField";
import { IView } from "ts/Views/View";
import { ParticleFieldView } from "ts/Views/ParticleFieldView";
import { PolyView, PolyGraphic } from "ts/Views/PolyViews";
import { ValueView } from "ts/Views/TextView";
import { LandingBasicShipData, BasicShipData } from "ts/Data/ShipData";
import { GraphicData, IGraphic } from "ts/Data/GraphicData";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { SurfaceGenerator } from "ts/States/LandExplorer/SurfaceGenerator";
import { ExplosionEnactment } from "ts/States/Ship/ExplosionEnactment";
import { Mover } from "ts/Actors/Movers";


class PlanetSurface extends GameObject<PlanetSurfaceModel> { }

class WindDirectionIndicator extends GameObject<WindModel> { }

class LandingBasicShip extends GameObject<LandingShipModel> { }

export class BasicShip extends GameObject<BasicShipModel> { }

export class LandExplorerState implements IGameState {
    wind : WindDirectionIndicator;
    surface: PlanetSurface;
    explosion: ExplosionEnactment;
    landingPad: GameObject<LandingPadModel>;
    velocityText: TextObject;
    interactors: IInteractor[];
    
    viewScale: number;
    zoom: number;
    exitState: boolean = false;
    
    constructor(public name: string, private assets: Assets, private player: BasicShip, private guiObjects: Array<IGameObject>, private sceneObjects: Array<IGameObject>) {
        this.viewScale = 1;
        this.zoom = 1;
        this.player = player;

        let eModel: ParticleFieldModel = ExplosionEnactment.createGroundExplosion(player.model.data);
        this.explosion = new ExplosionEnactment(eModel);
        
        this.surface = LandExplorerState.createPlanetSurfaceObject(new Coordinate(0, 0), player.model.data);
        this.landingPad = LandExplorerState.createLandingPadObject(this.surface);
        // todo placement
        this.sceneObjects.push(this.surface, this.landingPad, this.player, this.explosion);

        // Gui Objects
        this.velocityText = new TextObject("", new Coordinate(325, 50), "monospace", 12);
        this.wind = LandExplorerState.createWindDirectionIndicator(new Coordinate(450, 50));
        this.guiObjects.push(this.velocityText);
        this.guiObjects.push(this.wind);

        var shipSurfaceDetector: IInteractor = new ObjectCollisionDetector(this.surface.model, this.player.model.data, this.playerSurfaceCollision.bind(this));
        var shipLandingPadDetector: IInteractor = new ObjectCollisionDetector(this.landingPad.model, this.player.model.data, this.playerLandingPadCollision.bind(this));
        var windEffect: IInteractor = new Interactor(this.wind.model, this.player.model, this.windEffectCallback);
        this.interactors = [shipSurfaceDetector, shipLandingPadDetector, windEffect];
    }
    
    update(lastDrawModifier : number){
        this.velocityText.model.data.text = "Velocity: " + Math.abs(Math.round(this.player.model.data.velY));
        
        this.sceneObjects.forEach(o => o.update(lastDrawModifier));
        this.guiObjects.forEach(o => o.update(lastDrawModifier));
    }
    
    input(keys: KeyStateProvider, lastDrawModifier: number) {
        if (keys.isKeyDown(Keys.UpArrow)) this.player.model.thrust();
        else this.player.model.noThrust();

        if (keys.isKeyDown(Keys.LeftArrow)) this.player.model.left(lastDrawModifier);
        if (keys.isKeyDown(Keys.RightArrow)) this.player.model.right(lastDrawModifier);
        if (keys.isKeyDown(Keys.SpaceBar)) this.player.model.shootPrimary();
        if (keys.isKeyDown(Keys.Z)) {
            this.viewScale = 0.01;
        }
        else if (keys.isKeyDown(Keys.X)) {
            this.viewScale = -0.01;
        }
        else this.viewScale = 0;
        this.zoom *= 1 + this.viewScale;
        if (keys.isKeyDown(Keys.Esc)) this.exitState = true;
    }
    
    display(drawingContext : DrawContext) {
        drawingContext.clear();
        // objects not affected by movement
        this.guiObjects.forEach(o => o.display(drawingContext));

        // scene objects
        drawingContext.save();
        drawingContext.translate((256 - this.player.model.data.location.x) + this.player.model.data.location.x * (1 - this.zoom),
            (240 - this.player.model.data.location.y) + this.player.model.data.location.y * (1 - this.zoom));
        drawingContext.zoom(this.zoom, this.zoom);
        this.sceneObjects.forEach(o => o.display(drawingContext));
        drawingContext.restore();
    }

    sound(actx: AudioContext) {
    }
    
    tests(lastTestModifier: number) { 
        this.interactors.forEach(interactor => interactor.test(lastTestModifier));
    }

    windEffectCallback(lastTestModifier: number, wind: WindModel, player: LandingShipModel) {
        player.data.velX += wind.data.value * lastTestModifier;
    }

    playerLandingPadCollision() {
        if (this.player.model.data.velY > 0) {
            console.log("Land velocity: " + this.player.model.data.velY);

            if (this.player.model.data.velY > 20) {
                this.player.model.crash();
                this.explosion.on();
            }

            this.player.model.data.velY = 0;
            this.player.model.data.velX = 0;
        }
    }

    playerSurfaceCollision() {
        this.player.model.data.velY = 0;
        this.player.model.data.velX = 0;
        this.player.model.crash();
        this.explosion.on();
    }
    
    returnState() : number {
        let s = undefined;
        if (this.exitState) {
            this.exitState = false;
            s = 0;
        }
        return s;
    }

    static create(assets: Assets): LandExplorerState {
        // Background
        //var field1 = new ParticleField('img/star.png', 512, 200, 32, 1);
        var pFieldData: ParticleFieldData = new ParticleFieldData(1);
        var pFieldModel: ParticleFieldModel = new ParticleFieldModel(pFieldData,
            (now: number) => {
                var p = new ParticleData(512 * Math.random(), 0, 0, 16, now);
                var mover = new Mover(p);
                return new ParticleModel(p, [mover]);
            });
        var field: ParticleField = new ParticleField(pFieldModel, 2, 2);

        // ships        
        let ship = LandExplorerState.createShip(new Coordinate(256, 240), 0, 0, 0, 0);
        var text = new TextObject("SpaceCommander", new Coordinate(10, 20), "Arial", 18);
        var landingState = new LandExplorerState("Lander", assets, ship, [text], [field]);
        return landingState;
    }

    static createPlanetSurfaceObject(location: Coordinate, from: ILocated): PlanetSurface {
        
        var model = new PlanetSurfaceModel(location);
        var surfaceGenerator = new SurfaceGenerator(from, model.shape);
        surfaceGenerator.initSurface();
        model.actors.push(surfaceGenerator);
        var terrain = new GraphicData("res/img/terrain.png");
        var surface: PolyGraphic = new PolyGraphic(model.data, model.shape, terrain);
        var obj = new PlanetSurface(model, [surface]);
        return obj;
    }

    static createLandingPadObject(surface: PlanetSurface): GameObject<LandingPadModel> {
        var placeIndex = Transforms.random(0, 50);
        var xy = surface.model.shape.points[placeIndex];
        var padModel = new LandingPadModel(new Coordinate(xy.x + surface.model.data.location.x,
            xy.y + surface.model.data.location.y));
        var padView: IView = new PolyView(padModel.data, padModel.shape);
        var obj = new GameObject<LandingPadModel>(padModel, [padView]);
        return obj;
    }

    static createWindDirectionIndicator(location: Coordinate): WindDirectionIndicator {
        var model: WindModel = new WindModel(location);
        var viewArrow: IView = new PolyView(model.data, model.shape); // arrow shape
        var viewText: IView = new ValueView(model.data, "{0} mph", "monospace", 12);
        var obj = new WindDirectionIndicator(model, [viewArrow, viewText]);
        return obj;
    }

    static createShip(location: Coordinate, velx: number, vely: number, angle: number, spin: number) {

        var shipModel: BasicShipModel = new BasicShipModel(new BasicShipData(location, velx, vely, angle, spin));
        var gravityForce = new VectorAccelerator(shipModel.data, new Vector(180, 10));
        shipModel.actors.push(gravityForce);
        var shipView: IView = new PolyView(shipModel.data, shipModel.shape);

        var weaponView: IView = new ParticleFieldView(shipModel.weaponModel, 1, 1);
        var thrustView: ParticleFieldView = new ParticleFieldView(shipModel.thrustParticleModel.data, 1, 1);

        var views: IView[] = [shipView, weaponView, thrustView];
        var obj = new BasicShip(shipModel, views);
        return obj;
    }
}