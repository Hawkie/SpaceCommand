import { DrawContext} from "./Common/DrawContext";
import { IGameObject, StaticGameObject, MovingGameObject } from "./Common/GameObject";
import { BasicShip } from "./Ship"

import { DotField } from "./DotField";


export interface IGameState
{
    update(lastDrawModifier : number);
    display(drawingContext : DrawContext);
    input(keys : ()=> Array<number>, lastDrawModifier : number);
    hasEnded() : boolean;
}

export class PlayGameState implements IGameState {
    player : BasicShip;
    objects : IGameObject[];
    
    constructor(player : BasicShip, objects : IGameObject[]) {
        this.player = player;
        this.objects = objects;

    }

    update(lastDrawModifier : number) {
        this.player.update(lastDrawModifier);
        for (var index = 0; index < this.objects.length; index++) {
            var element = this.objects[index];
            element.update(lastDrawModifier);
        }
    }

    input(keys : () => Array<number>, lastDrawModifier : number) {
        var k = keys();
        if (k.indexOf(38) > -1) { // Player holding up
                this.player.thrust(lastDrawModifier);
        }
        // // if (40 in keysDown) { // Player holding down
        // //     player.y += player.speed * lastDrawModifier;
        // // }
        if (k.indexOf(37) > -1) { // Player holding left
            this.player.rotateLeft(lastDrawModifier);
        }
        if (k.indexOf(39) > -1) { // Player holding right
            this.player.rotateRight(lastDrawModifier);
        }
        // space bar (shoot)
        if (k.indexOf(32) > -1) {
            this.player.shootPrimary(lastDrawModifier);   
        }
    }

    display(drawingContext : DrawContext) {
        drawingContext.clear();
        this.player.display(drawingContext);
        for (var index = 0; index < this.objects.length; index++) {
            var element = this.objects[index];
            element.display(drawingContext);
        }
    }
    
    hasEnded() : boolean {
        return false;
    }

}
