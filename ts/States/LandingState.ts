import { IGameState } from "./GameState";
import { SparseArray } from "../Collections/SparseArray";
import { DrawContext} from "../Common/DrawContext";
import { IGameObject } from "../GameObjects/GameObject"
import { TextObject, ParticleField, PlanetSurface, LandingPad, LandingBasicShip } from "../GameObjects/SpaceObject"
import { WindDirectionIndicator } from "../GameObjects/Gui/WindDirectionIndicator";
import { Keys, KeyStateProvider } from "../Common/KeyStateProvider";
import { Coordinate } from "../Physics/Common";
import { PlanetSurfaceModel } from "../Models/Land/PlanetSurface";
import { LandingPadModel } from "../Models/Land/LandingPad";
import { IParticleModel, IParticleFieldModel, ParticleModel, ParticleFieldModel } from "../Models/ParticleFieldModel";

export class LandingState implements IGameState {
    //player : LandingBasicShip;
    //objects : Array<IGameObject>;
    wind : WindDirectionIndicator;
    surface: PlanetSurface;
    landingPad: LandingPad;
    velocityText: TextObject;

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
        this.landingPad = new LandingPad(new Coordinate(0, 0)); 
        this.velocityText = new TextObject("", new Coordinate(325, 50), "monospace", 12);
        this.objects.push(this.surface);
        this.objects.push(this.velocityText);
        this.objects.push(this.wind);
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
    
    tests(){
        if(this.surface.hitTest(this.player.model.location))
            this.surface.hit(this.player);
        if(this.landingPad.hitTest(this.player.model.location)){
            this.landingPad.hit(this.player);
        }
    }
    
    returnState() : IGameState {
        return null;
    }
}