import { DrawContext} from "../Common/DrawContext";
import { IGameObject, IHittable, StaticGameObject, MovingGameObject } from "../Common/GameObject";
import { BasicShip } from "../Ships/Ship";
import { SparseArray } from "../Collections/SparseArray";
import { DotField } from "../Space/DotField";
import { Coordinate } from "../Common/Coordinate";
import { Asteroid } from "../Space/Asteroid";
import { IGameState } from "GameState";
import { Keys, KeyStateProvider } from "../Common/KeyStateProvider";


export class AsteroidState implements IGameState {
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
        this.objects.forEach(o => o.update(lastDrawModifier));
        this.asteroids.forEach(x => x.update(lastDrawModifier));
        this.player.update(lastDrawModifier);
    }
    
    // order is important. Like layers on top of each other.
    display(drawingContext : DrawContext) {
        drawingContext.clear();
        this.objects.forEach(o => o.display(drawingContext));
        this.asteroids.forEach(x => x.display(drawingContext));
        this.player.display(drawingContext);
    }
    
    input(keys: KeyStateProvider, lastDrawModifier: number) {
        if (keys.isKeyDown(Keys.UpArrow)) this.player.thrust(lastDrawModifier);
        if (keys.isKeyDown(Keys.LeftArrow)) this.player.rotateLeft(lastDrawModifier);
        if (keys.isKeyDown(Keys.RightArrow)) this.player.rotateRight(lastDrawModifier);
        if (keys.isKeyDown(Keys.SpaceBar)) this.player.shootPrimary(lastDrawModifier);
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
            for (let a=0; a < this.asteroids.length; a++){
                let asteroid = this.asteroids[a];
                // todo make this local function so we can remove bullet
                if (asteroid.hitTest(bullet.location)){
                    asteroid.hit();
                    bullets.splice(i, 1);
                    this.asteroids.push(this.createAsteroid(asteroid.location));
                    break;
                }
            };
        }
    }
    
    private createAsteroid(location : Coordinate) : Asteroid {
        return new Asteroid(new Coordinate(location.x, location.y), Math.random() * 5, Math.random() * 5,Math.random() * 360, Math.random() * 10);
    }
    
    hasEnded() : boolean {
        return false;
    }

}
