import { DrawContext} from "../Common/DrawContext";
import { IGameObject } from "../GameObjects/GameObject";
import { TextObject, ParticleField, BasicShip, Asteroid } from "../GameObjects/SpaceObject";
import { SparseArray } from "../Collections/SparseArray";
import { ParticleFieldModel } from "../Models/ParticleFieldModel";
import { Rect } from "../DisplayObjects/DisplayObject";
import { Coordinate } from "../Physics/Common";
import { TextModel } from "../Models/TextModel";
import { TextView } from "../Views/TextView";
import { IGameState } from "GameState";
import { Keys, KeyStateProvider } from "../Common/KeyStateProvider";


export class AsteroidState implements IGameState {
// data objects
// data updaters
// graphic objects
// data to graphic binders
// graphic drawers

    //player : BasicShip;
    //objects : Array<IGameObject>;
    //asteroids : Array<Asteroid>;
    
    static create(): AsteroidState {
        //var field1 = new ParticleField('img/star.png', 512, 200, 32, 1);
        var particleFieldModel: ParticleFieldModel = new ParticleFieldModel(1);
        var field: ParticleField = new ParticleField(particleFieldModel,
            () => { return 512 * Math.random(); },
            () => { return 0; },
            () => { return 0; },
            () => { return 16; }, 2, 2);
         

        // special
        let ship = new BasicShip(new Coordinate(256, 240), 0, 0, 0, 0);
        let asteroid1 = new Asteroid(new Coordinate(200, 230), 2, 2, 40, -2);

        var text: IGameObject = new TextObject("SpaceCommander", new Coordinate(10, 20), "Arial", 18);
        var objects: Array<IGameObject> = [field, text];
        var asteroids: Array<Asteroid> = [asteroid1];

        var asteroidState = new AsteroidState("Asteroids", ship, objects, asteroids);
        return asteroidState;
    }
    
    constructor(public name: string, private player : BasicShip, private objects : Array<IGameObject>, private asteroids : Array<Asteroid>) {
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
            this.player.thrust();
        else
            this.player.noThrust();
        if (keys.isKeyDown(Keys.LeftArrow)) this.player.left(lastDrawModifier);
        if (keys.isKeyDown(Keys.RightArrow)) this.player.right(lastDrawModifier);
        if (keys.isKeyDown(Keys.SpaceBar)) this.player.shootPrimary();
    }

    bulletHitAsteroidTest(){
        var bullets = this.player.weaponModel.points;
        for (let i=0;i<bullets.length;i++)
        {
            let bullet = bullets[i];
            for (let a=0; a < this.asteroids.length; a++){
                let asteroid = this.asteroids[a];
                // todo make this local function so we can remove bullet
                if (asteroid.hitTest(bullet.location)){
                    asteroid.hit();
                    bullets.splice(i, 1);
                    this.asteroids.push(this.createAsteroid(asteroid.model.location));
                    break;
                }
            };
        }
    }
    
    playerHitAsteroidTest() {
        for (let a = 0; a < this.asteroids.length; a++) {
            let asteroid = this.asteroids[a];
            // todo make this local function so we can remove bullet
            for (let p = 0; p < this.player.model.points.length - 2; p++) {
                let point = this.player.model.points[p];
                let location = new Coordinate(this.player.model.location.x + point.x, this.player.model.location.y + point.y);
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
