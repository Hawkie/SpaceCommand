import { DrawContext} from "../Common/DrawContext";
import { IGameObject, StaticGameObject, MovingGameObject, GameObjectArray } from "../Common/GameObject";
import { BasicShip } from "../Ships/Ship"
import { SparseArray } from "../Collections/SparseArray"
import { DotField } from "../Space/DotField";


export interface IGameState
{
    update(lastDrawModifier : number);
    display(drawingContext : DrawContext);
    input(keys : ()=> SparseArray<number>, lastDrawModifier : number);
    hasEnded() : boolean;
}

export class PlayGameState implements IGameState {
    player : BasicShip;
    objects : GameObjectArray;
    
    constructor(player : BasicShip, objects : GameObjectArray) {
        this.player = player;
        this.objects = objects;

    }

    update(lastDrawModifier : number) {
        this.player.update(lastDrawModifier);
        this.objects.update(lastDrawModifier);
    }

    input(keys : () => SparseArray<number>, lastDrawModifier : number) {
        var k = keys();
        if (k.contains(38)) { // Player holding up
                this.player.thrust(lastDrawModifier);
        }
        // // if (40 in keysDown) { // Player holding down
        // //     player.y += player.speed * lastDrawModifier;
        // // }
        if (k.contains(37)) { // Player holding left
            this.player.rotateLeft(lastDrawModifier);
        }
        if (k.contains(39)) { // Player holding right
            this.player.rotateRight(lastDrawModifier);
        }
        // space bar (shoot)
        if (k.contains(32)) {
            this.player.shootPrimary(lastDrawModifier);   
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
