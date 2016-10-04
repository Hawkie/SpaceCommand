﻿import { DrawContext} from "ts/Common/DrawContext";
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
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
import { Model, ShapedModel } from "ts/Models/DynamicModels";
import { WindModel } from "ts/States/Land/WindModel";
import { LandingPadModel } from "ts/States/Land/LandingPad";
import { ShipComponents } from "ts/Controllers/Ship/ShipComponents";
import { SpaceShipController } from "ts/Controllers/Ship/ShipController";

import { IInteractor, Interactor } from "ts/Interactors/Interactor";
import { ObjectCollisionDetector } from "ts/Interactors/CollisionDetector";

import { IGameObject, SingleGameObject, MultiGameObject } from "ts/GameObjects/GameObject"
import { TextObject } from "ts/GameObjects/TextObject";
import { Field } from "ts/GameObjects/ParticleField";
import { IView } from "ts/Views/View";
import { PolyView, PolyGraphic } from "ts/Views/PolyViews";
import { ValueView } from "ts/Views/TextView";
import { LandingShipData, SpaceShipData } from "ts/Data/ShipData";
import { GraphicData, IGraphic } from "ts/Data/GraphicData";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { SurfaceGenerator } from "ts/States/LandExplorer/SurfaceGenerator";
import { ExplosionController } from "ts/Controllers/Ship/ExplosionController";
import { Mover } from "ts/Actors/Movers";
import { WindGenerator } from "ts/Actors/WindGenerator";
import { IActor } from "ts/Actors/Actor";
import { BulletWeaponController } from "ts/Controllers/Ship/WeaponController";
import { ThrustController } from "ts/Controllers/Ship/ThrustController";



export class LandExplorerState implements IGameState {
    wind: SingleGameObject<WindModel>;
    surface: SingleGameObject<PlanetSurfaceModel>;
    landingPad: SingleGameObject<LandingPadModel>;
    velocityText: TextObject;
    interactors: IInteractor[];
    
    viewScale: number;
    zoom: number;
    exitState: boolean = false;
    
    constructor(public name: string, private assets: Assets, private player: SpaceShipController, private guiObjects: IGameObject[], private sceneObjects: IGameObject[]) {
        this.viewScale = 1;
        this.zoom = 1;
        this.player = player;

        // scene objects
        this.surface = LandExplorerState.createPlanetSurfaceObject(new Coordinate(0, 0), player.chassisObj.model.physics);
        this.landingPad = LandExplorerState.createLandingPadObject(this.surface);
        this.sceneObjects.push(this.surface, this.landingPad, this.player.chassisObj, this.player.thrustController, this.player.weaponController, this.player.explosionController.field);

        // Gui Objects
        this.velocityText = new TextObject("", new Coordinate(325, 50), "monospace", 12);
        this.wind = LandExplorerState.createWindDirectionIndicator(new Coordinate(450, 50));
        this.guiObjects.push(this.velocityText, this.wind, this.player.explosionController.screenFlash);

        var shipSurfaceDetector: IInteractor = new ObjectCollisionDetector(this.surface.model, this.player.chassisObj.model.physics, this.playerSurfaceCollision.bind(this));
        var shipLandingPadDetector: IInteractor = new ObjectCollisionDetector(this.landingPad.model, this.player.chassisObj.model.physics, this.playerLandingPadCollision.bind(this));
        var windEffect: IInteractor = new Interactor(this.wind.model, this.player, this.windEffectCallback);
        this.interactors = [shipSurfaceDetector, shipLandingPadDetector, windEffect];
    }
    
    update(lastDrawModifier : number){
        this.velocityText.model.text = "Velocity: " + Math.abs(Math.round(this.player.chassisObj.model.physics.velY));
        
        this.sceneObjects.forEach(o => o.update(lastDrawModifier));
        this.guiObjects.forEach(o => o.update(lastDrawModifier));
    }
    
    input(keys: KeyStateProvider, lastDrawModifier: number) {
        if (keys.isKeyDown(Keys.UpArrow)) this.player.thrust();
        else this.player.noThrust();

        if (keys.isKeyDown(Keys.LeftArrow)) this.player.left(lastDrawModifier);
        if (keys.isKeyDown(Keys.RightArrow)) this.player.right(lastDrawModifier);
        if (keys.isKeyDown(Keys.SpaceBar)) this.player.shootPrimary();
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
        let x = this.player.chassisObj.model.physics.location.x;
        // drawing origin moves to centre - ship location (when location > centre, origin moves left)
        drawingContext.translate(256 - x + x * (1 - this.zoom),
            (240 - this.player.chassisObj.model.physics.location.y) + this.player.chassisObj.model.physics.location.y * (1 - this.zoom));
        drawingContext.zoom(this.zoom, this.zoom);
        this.sceneObjects.forEach(o => o.display(drawingContext));
        drawingContext.restore();

    }

    sound(actx: AudioContext) {
    }
    
    tests(lastTestModifier: number) { 
        this.interactors.forEach(interactor => interactor.test(lastTestModifier));
    }

    windEffectCallback(lastTestModifier: number, wind: WindModel, controller: SpaceShipController) {
        controller.chassisObj.model.physics.velX += wind.physics.value * lastTestModifier;
    }

    playerLandingPadCollision() {
        if (this.player.chassisObj.model.physics.velY > 0) {
            console.log("Land velocity: " + this.player.chassisObj.model.physics.velY);

            if (this.player.chassisObj.model.physics.velY > 20) {
                this.player.crash();
            }

            this.player.chassisObj.model.physics.velY = 0;
            this.player.chassisObj.model.physics.velX = 0;
        }
    }

    playerSurfaceCollision() {
        this.player.chassisObj.model.physics.velY = 0;
        this.player.chassisObj.model.physics.velX = 0;
        this.player.crash();
    }
    
    returnState() : number {
        let s = undefined;
        if (this.exitState) {
            this.exitState = false;
            s = 0;
        }
        return s;
    }

    static create(assets: Assets, actx:AudioContext): LandExplorerState {
        // Background
        //var field1 = new ParticleField('img/star.png', 512, 200, 32, 1);
        var field = Field.createBackgroundField(16, 2);

        // ship = space ship controller with gravity
        var spaceShipData = new SpaceShipData(new Coordinate(256, 240), 0, 0, 0, 0);
        var chassisObj = ShipComponents.createShipObj(spaceShipData);
        var weaponController = BulletWeaponController.createWeaponController(chassisObj.model.physics, actx);
        var thrustController = ThrustController.createGroundThrust(chassisObj.model.physics, chassisObj.model.shape);
        var explosionController = ExplosionController.createGroundExplosion(chassisObj.model.physics);
        var shipController = new SpaceShipController(spaceShipData, chassisObj, weaponController, thrustController, explosionController);

        var gravityForce = new VectorAccelerator(shipController.chassisObj.model.physics, new Vector(180, 10));
        shipController.chassisObj.actors.push(gravityForce);

        var text = new TextObject("SpaceCommander", new Coordinate(10, 20), "Arial", 18);
        var landingState = new LandExplorerState("Lander", assets, shipController, [text], [field]);
        return landingState;
    }

    static createPlanetSurfaceObject(location: Coordinate, from: ILocated): SingleGameObject<PlanetSurfaceModel> {
        
        var model = new PlanetSurfaceModel(location);
        var surfaceGenerator = new SurfaceGenerator(from, model.shape);
        surfaceGenerator.initSurface();
        var terrain = new GraphicData("res/img/terrain.png");
        var surface: PolyGraphic = new PolyGraphic(model.physics, model.shape, terrain);
        var obj = new SingleGameObject(model, [surfaceGenerator], [surface]);
        return obj;
    }

    static createLandingPadObject(surface: SingleGameObject<PlanetSurfaceModel>): SingleGameObject<LandingPadModel> {
        var placeIndex = Transforms.random(0, 50);
        var xy = surface.model.shape.points[placeIndex];
        var padModel = new LandingPadModel(new Coordinate(xy.x + surface.model.physics.location.x,
            xy.y + surface.model.physics.location.y));
        var padView: IView = new PolyView(padModel.physics, padModel.shape);
        var obj = new SingleGameObject<LandingPadModel>(padModel, [], [padView]);
        return obj;
    }

    static createWindDirectionIndicator(location: Coordinate): SingleGameObject<WindModel> {
        var model: WindModel = new WindModel(location);
        var windGenerator: IActor = new WindGenerator(model.physics, model.shape);
        var viewArrow: IView = new PolyView(model.physics, model.shape); // arrow shape
        var viewText: IView = new ValueView(model.physics, "{0} mph", "monospace", 12);
        var obj = new SingleGameObject<WindModel>(model, [windGenerator], [viewArrow, viewText]);
        return obj;
    }
}