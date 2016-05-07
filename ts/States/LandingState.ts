import { IGameState } from "./GameState";
import { LandingBasicShip } from "../Ships/LandingShip";
import { SparseArray } from "../Collections/SparseArray";
import { DrawContext} from "../Common/DrawContext";
import { IGameObject } from "../GameObjects/GameObject"
import { Keys, KeyStateProvider } from "../Common/KeyStateProvider";
import { Wind } from "../Space/Wind";
import { Coordinate } from "../Physics/Common";
import { PlanetSurface } from "../Space/PlanetSurface";
import { GuiText } from "../Gui/GuiText";
import { DotField } from "../Space/Dotfield";

export class LandingState implements IGameState {
    player : LandingBasicShip;
    objects : Array<IGameObject>;
    wind : Wind;
    surface : PlanetSurface;
    velocityText: GuiText;

    static create(): LandingState {
        // Background
        //var field1 = new ParticleField('img/star.png', 512, 200, 32, 1);
        var field2 = new DotField(-1, 0, 0, -16, 1, 1);
        //var field3 = new DotField(512, 200, 8, 1, 1, 1);
        

        // ships        
        let landingShip = new LandingBasicShip(new Coordinate(256, 240));

        var text = new GuiText("SpaceCommander", new Coordinate(10, 20), "Arial", 18);
        var objects: Array<IGameObject> = [field2, text];
        var landingState = new LandingState(landingShip, objects);
        return landingState;
    }
    
    constructor(player : LandingBasicShip, objects : Array<IGameObject>){
        this.player = player;
        this.objects = new Array<IGameObject>();
        this.objects.concat(objects);
        this.wind = new Wind(new Coordinate(450,50), 12, 300);
        this.surface = new PlanetSurface(new Coordinate(0, 400));
        this.velocityText = new GuiText("", new Coordinate(325, 50), "monospace", 12);
        this.objects.push(this.surface);
        this.objects.push(this.velocityText);
    }
    
    update(lastDrawModifier : number){
        this.velocityText.text = "Velocity: " + Math.abs(Math.round(this.player.velY));
        
        this.player.update(lastDrawModifier);
        this.objects.forEach(o => o.update(lastDrawModifier));
        this.wind.update(lastDrawModifier, this.player);
    }
    
    input(keys: KeyStateProvider, lastDrawModifier: number) {
        if (keys.isKeyDown(Keys.UpArrow)) this.player.thrust();
        else this.player.noThrust();

        if (keys.isKeyDown(Keys.LeftArrow)) this.player.moveLeft(lastDrawModifier);
        else if (keys.isKeyDown(Keys.RightArrow)) this.player.moveRight(lastDrawModifier);
        else this.player.notMovingOnX(lastDrawModifier);
    }
    
    display(drawingContext : DrawContext) {
        drawingContext.clear();
        this.player.display(drawingContext);
        this.objects.forEach(o => o.display(drawingContext));
        this.wind.display(drawingContext);
    }
    
    tests(){
        if(this.surface.hitTest(this.player.location))
            this.surface.hit(this.player);
        if(this.surface.landingPad.hitTest(this.player.location)){
            this.surface.landingPad.hit(this.player);
        }
    }
    
    returnState() : IGameState {
        return null;
    }
}