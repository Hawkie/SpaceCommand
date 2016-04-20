import { IGameState } from "./GameState";
import { LandingBasicShip } from "../Ships/LandingShip";
import { SparseArray } from "../Collections/SparseArray";
import { DrawContext} from "../Common/DrawContext";
import { GameObjectArray } from "../Common/GameObject";

export class LandingState implements IGameState{
    player : LandingBasicShip;
    objects : GameObjectArray;
    
    constructor(player : LandingBasicShip, objects : GameObjectArray){
        this.player = player;
        this.objects = objects;
    }
    
    update(lastDrawModifier : number){
        this.player.update(lastDrawModifier);
        this.objects.update(lastDrawModifier);
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
        this.objects.display(drawingContext);
    }
    
    hasEnded() : boolean {
        return false;
    }
}