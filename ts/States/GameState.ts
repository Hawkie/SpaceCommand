import { DrawContext} from "../Common/DrawContext";
import { IGameObject, IHittable, StaticGameObject, MovingGameObject } from "../Common/GameObject";
import { BasicShip } from "../Ships/Ship"
import { SparseArray } from "../Collections/SparseArray"
import { DotField } from "../Space/DotField";
import { Coordinate } from "../Common/Coordinate"
import { Asteroid } from "../Space/Asteroid"


export interface IGameState
{
    update(lastDrawModifier : number);
    display(drawingContext : DrawContext);
    input(keys : ()=> SparseArray<number>, lastDrawModifier : number);
    tests();
    hasEnded() : boolean;
}

export class PlayGameState implements IGameState {
    player : BasicShip;
    objects : Array<IGameObject>;
    asteroids : Array<Asteroid>;
    //hitInteraction : Interaction<Coordinate, IHittable>
    
    constructor(player : BasicShip, objects : Array<IGameObject>, asteroids : Array<Asteroid>) {
        this.player = player;
        this.objects = objects;
        this.asteroids = asteroids;
    }

    update(lastDrawModifier : number) {
        this.player.update(lastDrawModifier);
        this.objects.forEach(o => o.update(lastDrawModifier));
        this.asteroids.forEach(x => x.update(lastDrawModifier));
    }
    
    display(drawingContext : DrawContext) {
        drawingContext.clear();
        this.player.display(drawingContext);
        this.objects.forEach(o => o.display(drawingContext));
        this.asteroids.forEach(x => x.display(drawingContext));
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

    tests(){
        // let hitFunction = function(location : Coordinate, asteroid : IHittable){
        //     if (asteroid.hitTest(location)){
        //         // breaks rule of immutable (e.g. won't be able to make asteroid  immutable!)
        //         asteroid.velx +=2;
        //         asteroid.spin +=1;
        //     }
        // }
        var bullets = this.player.primaryWeapon.projectiles;
        for (let i=0;i<bullets.length;i++)
        {
            let bullet = bullets[i];
            this.asteroids.forEach(asteroid => {
                // todo make this local function so we can remove bullet
                if (asteroid.hitTest(bullet.location)){
                    asteroid.hit();
                    this.asteroids.push(new Asteroid(new Coordinate(asteroid.location.x, asteroid.location.y), Math.random() * 5, Math.random() * 5,Math.random() * 360, Math.random() * 10));
                }
            });
        }
    }
    
    hasEnded() : boolean {
        return false;
    }

}
