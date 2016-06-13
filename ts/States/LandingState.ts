import { DrawContext} from "ts/Common/DrawContext";
import { Assets } from "ts/Resources/Assets";
import { AudioObject } from "ts/Sound/SoundObject";

import { Coordinate } from "ts/Physics/Common";
import { Keys, KeyStateProvider } from "ts/Common/KeyStateProvider";
import { IGameState } from "ts/States/GameState";
import { SparseArray } from "ts/Collections/SparseArray";

import { LocatedData } from "ts/Data/PhysicsData";
import { ShapeData } from "ts/Data/ShapeData";
import { Direction } from "ts/Data/WindData";
import { PlanetSurfaceModel } from "../Models/Land/PlanetSurface";
import { IParticleData, IParticleFieldData, ParticleData, ParticleFieldData, MovingParticleModel, MovingGravityParticleModel, ParticleFieldModel } from "ts/Models/ParticleFieldModel";
import { DynamicModel, ShapedModel, DisplayModel } from "ts/Models/DynamicModels";
import { WindModel } from "ts/Models/Land/WindModel";
import { LandingPadModel } from "../Models/Land/LandingPad";
import { LandingShipModel } from "ts/Models/Ships/LandingShip";

import { IInteractor, Interactor } from "ts/Interactors/Interactor";
import { ObjectCollisionDetector } from "ts/Interactors/CollisionDetector";

import { IGameObject } from "ts/GameObjects/GameObject"
import { TextObject } from "ts/GameObjects/Common/BaseObjects";
import { PlanetSurface } from "ts/GameObjects/Land/PlanetSurface"
import { WindDirectionIndicator } from "ts/GameObjects/Land/WindDirectionIndicator";
import { ParticleField } from "ts/GameObjects/Common/ParticleField";
import { LandingBasicShip } from "ts/GameObjects/Ships/LandingShip";

export class LandingState implements IGameState {
    wind : WindDirectionIndicator;
    surface: PlanetSurface;
    landingPad: LandingPadModel;
    velocityText: TextObject;
    interactors: IInteractor[];

    playExploded: boolean;
    explosionSound: AudioObject;
    exitState: boolean = false;

    static create(assets:Assets): LandingState {
        // Background
        //var field1 = new ParticleField('img/star.png', 512, 200, 32, 1);
        var pFieldData: ParticleFieldData = new ParticleFieldData(1);
        var pFieldModel: ParticleFieldModel = new ParticleFieldModel(pFieldData,
            (now: number) => new MovingParticleModel(new ParticleData(512 * Math.random(), 0, 0, 16, now)));
        var field: ParticleField = new ParticleField(pFieldModel, 2, 2);
        
        // ships        
        let landingShip = new LandingBasicShip(new Coordinate(256, 240));

        var text = new TextObject("SpaceCommander", new Coordinate(10, 20), "Arial", 18);
        var objects: Array<IGameObject> = [field, text];
        var landingState = new LandingState("Lander", assets, landingShip, objects);
        return landingState;
    }
    
    constructor(public name: string, private assets:Assets, private player : LandingBasicShip, private objects : Array<IGameObject>){
        this.player = player;
        this.objects = new Array<IGameObject>();
        this.objects.concat(objects);
        this.wind = new WindDirectionIndicator(new Coordinate(450,50));
        this.surface = new PlanetSurface(new Coordinate(0, 400));
        this.landingPad = this.surface.model.landingPad;
        // todo placement
        
        this.velocityText = new TextObject("", new Coordinate(325, 50), "monospace", 12);
        this.objects.push(this.surface);
        //this.objects.push(this.landingPad);
        this.objects.push(this.velocityText);
        this.objects.push(this.wind);

        var shipSurfaceDetector: IInteractor = new ObjectCollisionDetector(this.surface.model, this.player.model.data, this.playerSurfaceCollision.bind(this));
        var shipLandingPadDetector: IInteractor = new ObjectCollisionDetector(this.landingPad, this.player.model.data, this.playerLandingPadCollision.bind(this));
        var windEffect: IInteractor = new Interactor(this.wind.model, this.player.model, this.windEffect);
        this.interactors = [shipSurfaceDetector, shipLandingPadDetector, windEffect];
        this.playExploded = false;
        this.explosionSound = new AudioObject("res/sound/explosion.wav");
    }
    
    update(lastDrawModifier : number){
        this.velocityText.model.data.text = "Velocity: " + Math.abs(Math.round(this.player.model.data.velY));
        
        this.player.update(lastDrawModifier);
        this.objects.forEach(o => o.update(lastDrawModifier));
    }
    
    input(keys: KeyStateProvider, lastDrawModifier: number) {
        if (keys.isKeyDown(Keys.UpArrow)) this.player.model.thrust();
        else this.player.model.noThrust();

        if (keys.isKeyDown(Keys.LeftArrow)) this.player.model.left(lastDrawModifier);
        else if (keys.isKeyDown(Keys.RightArrow)) this.player.model.right(lastDrawModifier);
        else this.player.model.notMovingOnX(lastDrawModifier);
        if (keys.isKeyDown(Keys.Esc)) this.exitState = true;
    }
    
    display(drawingContext : DrawContext) {
        drawingContext.clear();
        this.player.display(drawingContext);
        this.objects.forEach(o => o.display(drawingContext));
        this.wind.display(drawingContext);
    }

    sound(actx: AudioContext) {
        if (this.player.model.crashed && !this.playExploded) {
            this.explosionSound.play();
            this.playExploded = true;
        }
    }
    
    tests(lastTestModifier: number) { 
        this.interactors.forEach(interactor => interactor.test(lastTestModifier));
    }

    windEffect(lastTestModifier: number, wind: WindModel, player: LandingShipModel) {
        player.data.velX += wind.data.value * lastTestModifier;
    }

    playerLandingPadCollision() {
        if (this.player.model.data.velY > 0) {
            console.log("Land velocity: " + this.player.model.data.velY);

            if (this.player.model.data.velY > 20) {
                this.player.model.crash();
            }

            this.player.model.data.velY = 0;
            this.player.model.data.velX = 0;
        }
    }

    playerSurfaceCollision() {
        this.player.model.data.velY = 0;
        this.player.model.data.velX = 0;
        this.player.model.crash();
    }
    
    returnState() : number {
        let s = undefined;
        if (this.exitState) {
            this.exitState = false;
            s = 0;
        }
        return s;
    }
}