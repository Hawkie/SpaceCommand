import { IGameState } from "./GameState";
import { LandingBasicShip } from "../Ships/LandingShip";
import { SparseArray } from "../Collections/SparseArray";
import { DrawContext} from "../Common/DrawContext";
import { IGameObject } from "../Common/GameObject"
import { Wind } from "../Space/Wind";
import { Coordinate } from "../Common/Coordinate";

export class LandingState implements IGameState {
    player : LandingBasicShip;
    objects : Array<IGameObject>;
    wind : Wind;
    
    constructor(player : LandingBasicShip, objects : Array<IGameObject>){
        this.player = player;
        this.objects = objects;
        this.wind = new Wind(new Coordinate(450,50), 0.3, 300);
    }
    
    update(lastDrawModifier : number){
        this.player.update(lastDrawModifier);
        this.objects.forEach(o => o.update(lastDrawModifier));
        this.wind.update(lastDrawModifier, this.player);
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
        this.wind.display(drawingContext);
    }
    
    tests(){}
    
    hasEnded() : boolean {
        return false;
    }
}