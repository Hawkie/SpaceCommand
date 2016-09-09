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
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
import { Model, ShapedModel } from "ts/Models/DynamicModels";
import { WindModel } from "ts/States/Land/WindModel";
import { LandingPadModel } from "ts/States/Land/LandingPad";
import { ShipComponents } from "ts/Controllers/Ship/ShipComponents";
import { LandShipController } from "ts/Controllers/Ship/ShipController";

import { IInteractor, Interactor } from "ts/Interactors/Interactor";
import { ObjectCollisionDetector } from "ts/Interactors/CollisionDetector";

import { IGameObject, SingleGameObject, MultiGameObject } from "ts/GameObjects/GameObject"
import { TextObject } from "ts/GameObjects/TextObject";
import { Field } from "ts/GameObjects/ParticleField";
import { IView } from "ts/Views/View";

import { PolyView, PolyGraphic } from "ts/Views/PolyViews";
import { ValueView } from "ts/Views/TextView";
import { LandingShipData } from "ts/Data/ShipData";
import { GraphicData, IGraphic } from "ts/Data/GraphicData";
import { SurfaceGenerator } from "ts/States/LandExplorer/SurfaceGenerator";
import { Mover } from "ts/Actors/Movers";
import { IActor } from "ts/Actors/Actor";
import { WindGenerator } from "ts/Actors/WindGenerator";
import { BulletWeaponController } from "ts/Controllers/Ship/WeaponController";
import { ThrustController } from "ts/Controllers/Ship/ThrustController";
import { ExplosionController } from "ts/Controllers/Ship/ExplosionController";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";

export class LandingState implements IGameState {
    wind: SingleGameObject<WindModel>;
    surface: SingleGameObject<PlanetSurfaceModel>;
    landingPad: SingleGameObject<LandingPadModel>;
    velocityText: TextObject;
    interactors: IInteractor[];
    exitState: boolean = false;

    
    constructor(public name: string, private assets:Assets, private player : LandShipController, private objects : Array<IGameObject>){
        this.player = player;

        this.wind = LandingState.createWindDirectionIndicator(new Coordinate(450,50));
        this.surface = LandingState.createPlanetSurfaceObject(new Coordinate(0, 0), this.player.chassisObj.model.physics);
        this.landingPad = LandingState.createLandingPadObject(this.surface);
        
        this.velocityText = new TextObject("", new Coordinate(325, 50), "monospace", 12);
        
        
        this.objects.push(this.surface);
        this.objects.push(this.landingPad);
        this.objects.push(this.player);
        this.objects.push(this.velocityText);
        this.objects.push(this.wind);
        

        var shipSurfaceDetector: IInteractor = new ObjectCollisionDetector(this.surface.model, this.player.chassisObj.model.physics, this.playerSurfaceCollision.bind(this));
        var shipLandingPadDetector: IInteractor = new ObjectCollisionDetector(this.landingPad.model, this.player.chassisObj.model.physics, this.playerLandingPadCollision.bind(this));
        var windEffect: IInteractor = new Interactor(this.wind.model, this.player.chassisObj.model, this.windEffect);
        this.interactors = [shipSurfaceDetector, shipLandingPadDetector, windEffect];
    }
    
    update(lastDrawModifier: number) {
        this.velocityText.model.text = "Velocity: " + Math.abs(Math.round(this.player.chassisObj.model.physics.velY));
        this.objects.forEach(o => o.update(lastDrawModifier));
    }
    
    input(keys: KeyStateProvider, lastDrawModifier: number) {
        if (keys.isKeyDown(Keys.UpArrow)) this.player.thrust();
        else this.player.noThrust();

        if (keys.isKeyDown(Keys.LeftArrow)) this.player.left(lastDrawModifier);
        else if (keys.isKeyDown(Keys.RightArrow)) this.player.right(lastDrawModifier);
        else this.player.notMovingOnX(lastDrawModifier);
        if (keys.isKeyDown(Keys.Esc)) this.exitState = true;
    }
    
    display(drawingContext : DrawContext) {
        drawingContext.clear();
        this.objects.forEach(o => o.display(drawingContext));
    }

    sound(actx: AudioContext) {
    }
    
    tests(lastTestModifier: number) { 
        this.interactors.forEach(interactor => interactor.test(lastTestModifier));
    }

    windEffect(lastTestModifier: number, wind: WindModel, player: ShapedModel<LandingShipData, ShapeData>) {
        player.physics.velX += wind.physics.value * lastTestModifier;
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

    static create(assets: Assets, actx:AudioContext): LandingState {
        // Background
        //var field1 = new ParticleField('img/star.png', 512, 200, 32, 1);
        var field = Field.createBackgroundField(16, 2);

        // ships        
        var shipData = new LandingShipData(new Coordinate(256, 240));
        var shipObj = ShipComponents.createShipObj(shipData);
        var weaponController = BulletWeaponController.createWeaponController(shipObj.model.physics, actx);
        var thrustController = ThrustController.createGroundThrust(shipObj.model.physics, shipObj.model.shape);
        var explosionController = ExplosionController.createGroundExplosion(shipObj.model.physics);
        var shipController = new LandShipController(shipObj, weaponController, thrustController, explosionController);

        var gravityForce = new VectorAccelerator(shipController.chassisObj.model.physics, new Vector(180, 10));
        shipController.chassisObj.actors.push(gravityForce);

        var text = new TextObject("SpaceCommander", new Coordinate(10, 20), "Arial", 18);
        var objects: Array<IGameObject> = [field, text];
        var landingState = new LandingState("Lander", assets, shipController, objects);
        return landingState;
    }


    static createPlanetSurfaceObject(location: Coordinate, from: ILocated): SingleGameObject<PlanetSurfaceModel> {
        var model = new PlanetSurfaceModel(location);
        var surfaceGenerator = new SurfaceGenerator(from, model.shape);
        surfaceGenerator.initSurface();
        var terrain = new GraphicData("res/img/terrain.png");
        var surface: PolyGraphic = new PolyGraphic(model.physics, model.shape, terrain);
        var obj = new SingleGameObject<PlanetSurfaceModel>(model, [], [surface]);
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