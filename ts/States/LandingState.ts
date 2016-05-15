import { Coordinate } from "ts/Physics/Common";
import { Keys, KeyStateProvider } from "ts/Common/KeyStateProvider";
import { IGameState } from "ts/States/GameState";
import { SparseArray } from "ts/Collections/SparseArray";
import { DrawContext} from "ts/Common/DrawContext";

import { PlanetSurfaceModel } from "../Models/Land/PlanetSurface";
import { LandingPadModel } from "../Models/Land/LandingPad";
import { IParticleModel, IParticleFieldModel, ParticleModel, ParticleFieldModel } from "ts/Models/ParticleFieldModel";

import { IInteractor } from "ts/Interactors/Interactor";
import { ObjectCollisionDetector } from "ts/Interactors/CollisionDetector";

import { IGameObject } from "ts/GameObjects/GameObject"
import { TextObject } from "ts/GameObjects/Common/BaseObjects";
import { PlanetSurface, LandingPad } from "ts/GameObjects/Land/LandObjects"
import { WindDirectionIndicator } from "ts/GameObjects/Land/WindDirectionIndicator";
import { ParticleField } from "ts/GameObjects/Common/ParticleField";
import { LandingBasicShip } from "ts/GameObjects/Ships/LandingShip";

export class LandingState implements IGameState {
    //player : LandingBasicShip;
    //objects : Array<IGameObject>;
    wind : WindDirectionIndicator;
    surface: PlanetSurface;
    landingPad: LandingPad;
    velocityText: TextObject;
    interactors: IInteractor[];

    static create(): LandingState {
        // Background
        //var field1 = new ParticleField('img/star.png', 512, 200, 32, 1);
        var particleFieldModel: ParticleFieldModel = new ParticleFieldModel(1);
        var field: ParticleField = new ParticleField(particleFieldModel, () => { return 512 * Math.random(); }, () => { return 0; }, () => {
            return 0;
        }, () => { return 16; }, 2, 2);
        

        // ships        
        let landingShip = new LandingBasicShip(new Coordinate(256, 240));

        var text = new TextObject("SpaceCommander", new Coordinate(10, 20), "Arial", 18);
        var objects: Array<IGameObject> = [field, text];
        var landingState = new LandingState("Lander", landingShip, objects);
        return landingState;
    }
    
    constructor(public name: string, private player : LandingBasicShip, private objects : Array<IGameObject>){
        this.player = player;
        this.objects = new Array<IGameObject>();
        this.objects.concat(objects);
        this.wind = new WindDirectionIndicator(new Coordinate(450,50));
        this.surface = new PlanetSurface(new Coordinate(0, 400));
        // todo placement
        this.landingPad = new LandingPad(this.surface.model.landingPad);
        this.velocityText = new TextObject("", new Coordinate(325, 50), "monospace", 12);
        this.objects.push(this.surface);
        this.objects.push(this.landingPad);
        this.objects.push(this.velocityText);
        this.objects.push(this.wind);

        var shipSurfaceDetector: IInteractor = new ObjectCollisionDetector(this.surface.model, this.player.model, this.playerSurfaceCollision.bind(this));
        var shipLandingPadDetector: IInteractor = new ObjectCollisionDetector(this.landingPad.model, this.player.model, this.playerLandingPadCollision.bind(this));
        this.interactors = [shipSurfaceDetector, shipLandingPadDetector];
    }
    
    update(lastDrawModifier : number){
        this.velocityText.model.text = "Velocity: " + Math.abs(Math.round(this.player.model.velY));
        
        this.player.update(lastDrawModifier);
        this.objects.forEach(o => o.update(lastDrawModifier));
        this.wind.windEffect(lastDrawModifier, this.player.model);
    }
    
    input(keys: KeyStateProvider, lastDrawModifier: number) {
        if (keys.isKeyDown(Keys.UpArrow)) this.player.thrust();
        else this.player.noThrust();

        if (keys.isKeyDown(Keys.LeftArrow)) this.player.left(lastDrawModifier);
        else if (keys.isKeyDown(Keys.RightArrow)) this.player.right(lastDrawModifier);
        else this.player.notMovingOnX(lastDrawModifier);
    }
    
    display(drawingContext : DrawContext) {
        drawingContext.clear();
        this.player.display(drawingContext);
        this.objects.forEach(o => o.display(drawingContext));
        this.wind.display(drawingContext);
    }
    
    tests() { 
        this.interactors.forEach(interactor => interactor.test());
    }

    playerLandingPadCollision() {
        if (this.player.model.velY > 0) {
            console.log("Land velocity: " + this.player.model.velY);

            if (this.player.model.velY > 20) {
                this.player.crash();
            }

            this.player.model.velY = 0;
            this.player.model.velX = 0;
        }
    }

    playerSurfaceCollision() {
        this.player.model.velY = 0;
        this.player.model.velX = 0;
        this.player.crash();
    }
    
    returnState() : IGameState {
        return null;
    }
}