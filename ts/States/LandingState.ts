import { IGameState } from "./GameState";
import { LandingBasicShip } from "../Ships/LandingShip";
import { SparseArray } from "../Collections/SparseArray";
import { DrawContext} from "../Common/DrawContext";
import { IGameObject } from "../Common/GameObject"
import { Keys, KeyStateProvider } from "../Common/KeyStateProvider";
import { Wind } from "../Space/Wind";
import { Coordinate } from "../Common/Coordinate";
import { PlanetSurface } from "../Space/PlanetSurface";
import { GuiText } from "../Gui/GuiText";

export class LandingState implements IGameState {
    player : LandingBasicShip;
    objects : Array<IGameObject>;
    wind : Wind;
    surface : PlanetSurface;
    velocityText : GuiText;
    
    constructor(player : LandingBasicShip, objects : Array<IGameObject>){
        this.player = player;
        this.objects = objects;
        this.wind = new Wind(new Coordinate(450,50), 0.3, 300);
        this.surface = new PlanetSurface(new Coordinate(0, 400));
        this.velocityText = new GuiText("", new Coordinate(325, 50), "monospace", 12);
        this.objects.push(this.surface);
        this.objects.push(this.velocityText);
    }
    
    update(lastDrawModifier : number){
        this.velocityText.text = "Velocity: " + Math.abs(Math.round(this.player.vely));
        
        this.player.update(lastDrawModifier);
        this.objects.forEach(o => o.update(lastDrawModifier));
        this.wind.update(lastDrawModifier, this.player);
    }
    
    input(keys: KeyStateProvider, lastDrawModifier: number) {
        if (keys.isKeyDown(Keys.UpArrow)) this.player.thrust(lastDrawModifier);

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
    
    hasEnded() : boolean {
        return false;
    }
}