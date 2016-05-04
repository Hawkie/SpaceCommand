import { DrawContext} from "../Common/DrawContext";
import { IGameObject, StaticGameObject, MovingGameObject } from "../Common/GameObject";
import { BasicShip } from "../Ships/Ship";
import { SparseArray } from "../Collections/SparseArray";
import { DotField } from "../Space/DotField";
import { ParticleField } from "../Space/ParticleField";
import { Rect } from "../DisplayObjects/DisplayObject";
import { Coordinate } from "../Common/Coordinate";
import { Asteroid } from "../Space/Asteroid";
import { GuiText } from "../Gui/GuiText";
import { IGameState } from "GameState";
import { Keys, KeyStateProvider } from "../Common/KeyStateProvider";


export class AsteroidState implements IGameState {
    player : BasicShip;
    objects : Array<IGameObject>;
    asteroids : Array<Asteroid>;
    
    static create(): AsteroidState {
        //var field1 = new ParticleField('img/star.png', 512, 200, 32, 1);
        var field = new ParticleField(() => { return 512 * Math.random(); }, () => { return 0; }, () => {
            return 0;
        }, () => { return 16; }, new Rect(2, 2), 1);
         
        //var field2 = new DotField(-1, 0, 0, -16, 1, 1);
        //var field3 = new DotField(512, 200, 8, 1, 1, 1);

        // special
        let ship = new BasicShip(new Coordinate(256, 240), 0, 0, 0, 0);
        let asteroid1 = new Asteroid(new Coordinate(200, 230), 2, 2, 40, -2);

        var text = new GuiText("SpaceCommander", new Coordinate(10, 20), "Arial", 18);
        var objects: Array<IGameObject> = [field, text];
        var asteroids: Array<Asteroid> = [asteroid1];

        var asteroidState = new AsteroidState(ship, objects, asteroids);
        return asteroidState;
    }
    
    constructor(player : BasicShip, objects : Array<IGameObject>, asteroids : Array<Asteroid>) {
        this.player = player;
        this.objects = objects;
        this.asteroids = asteroids;
    }

    
    update(lastDrawModifier : number) {
        this.objects.forEach(o => o.update(lastDrawModifier));
        this.asteroids.forEach(x => x.update(lastDrawModifier));
        this.player.update(lastDrawModifier);
        this.bulletHitAsteroidTest();
        this.playerHitAsteroidTest();
    }
    
    // order is important. Like layers on top of each other.
    display(drawingContext : DrawContext) {
        drawingContext.clear();
        this.objects.forEach(o => o.display(drawingContext));
        this.asteroids.forEach(x => x.display(drawingContext));
        this.player.display(drawingContext);
    }
    
    input(keys: KeyStateProvider, lastDrawModifier: number) {
        if (keys.isKeyDown(Keys.UpArrow))
            this.player.thrust(lastDrawModifier);
        else
            this.player.noThrust();
        if (keys.isKeyDown(Keys.LeftArrow)) this.player.rotateLeft(lastDrawModifier);
        if (keys.isKeyDown(Keys.RightArrow)) this.player.rotateRight(lastDrawModifier);
        if (keys.isKeyDown(Keys.SpaceBar)) this.player.shootPrimary(lastDrawModifier);
    }

    bulletHitAsteroidTest(){
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
    
    playerHitAsteroidTest() {
        for (let a = 0; a < this.asteroids.length; a++) {
            let asteroid = this.asteroids[a];
            // todo make this local function so we can remove bullet
            for (let p = 0; p < this.player.points.length - 2; p++) {
                let point = this.player.points[p];
                let location = new Coordinate(this.player.location.x + point.x, this.player.location.y + point.y);
                if (asteroid.hitTest(location)) {
                    this.player.crash();
                    break;
                }
            }
        }
    }

    tests() { }

    private createAsteroid(location : Coordinate) : Asteroid {
        return new Asteroid(new Coordinate(location.x, location.y), Math.random() * 5, Math.random() * 5,Math.random() * 360, Math.random() * 10);
    }
    
    returnState() : IGameState {
        return null;
    }

}
