import { IGameState } from "./GameState";
import { LandingBasicShip } from "../Ships/LandingShip";
import { SparseArray } from "../Collections/SparseArray";
import { DrawContext} from "../Common/DrawContext";
import { IGameObject } from "../Common/GameObject"
import { WindDirectionIndicator } from "../Gui/WindDirectionIndicator";
import { Coordinate } from "../Common/Coordinate";

export class LandingState implements IGameState {
    player : LandingBasicShip;
    objects : Array<IGameObject>;
    guiWindDirection : WindDirectionIndicator;
    
    constructor(player : LandingBasicShip, objects : Array<IGameObject>){
        this.player = player;
        this.objects = objects;
        this.guiWindDirection = new WindDirectionIndicator(new Coordinate(450,50));
    }
    
    update(lastDrawModifier : number){
        if(!(Math.floor(Math.random() * this.player.windChangeChance))){ // there's a 1 in windChangeChance of the wind changing direction
            console.log("Changing wind direction!");
            this.guiWindDirection.changeWindDirection();
        }
        this.player.wind(this.guiWindDirection.blowingRight);
        
        this.player.update(lastDrawModifier);
        this.objects.forEach(o => o.update(lastDrawModifier));
        this.guiWindDirection.update(lastDrawModifier);
    }
    
    input(keys : () => SparseArray<number>, lastDrawModifier : number) {
        var k = keys();
        if(k.contains(38)){ // Holding up arrow
            this.player.thrust(lastDrawModifier);
        }
        if(k.contains(37)){ // Holding left arrow
            this.player.moveLeft();
        }
        else if(k.contains(39)){ // Holding right arrow
            this.player.moveRight();
        }
        else{
            this.player.notMovingOnX();
        }
    }
    
    display(drawingContext : DrawContext) {
        drawingContext.clear();
        this.player.display(drawingContext);
        this.objects.forEach(o => o.display(drawingContext));
        this.guiWindDirection.display(drawingContext);
    }
    
    tests(){}
    
    hasEnded() : boolean {
        return false;
    }
}