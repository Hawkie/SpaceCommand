import { DrawContext} from "ts/Common/DrawContext";

import { SparseArray } from "ts/Collections/SparseArray";
import { ParticleFieldModel, ParticleModel } from "ts/Models/ParticleFieldModel";
import { AsteroidModel } from "ts/Models/Space/Asteroid";
import { Rect } from "ts/DisplayObjects/DisplayObject";
import { Coordinate } from "ts/Physics/Common";
import { TextModel } from "ts/Models/TextModel";
import { IShapeLocated } from "ts/Models/PolyModels";
import { TextView } from "ts/Views/TextView";
import { IGameState } from "ts/States/GameState";
import { IInteractor } from "ts/Interactors/Interactor"
import { Multi2ShapeCollisionDetector, Multi2MultiCollisionDetector } from "ts/Interactors/CollisionDetector";

import { Keys, KeyStateProvider } from "ts/Common/KeyStateProvider";
import { IGameObject } from "ts/GameObjects/GameObject";
import { TextObject } from "ts/GameObjects/Common/BaseObjects";
import { ParticleField } from "ts/GameObjects/Common/ParticleField";
import { BasicShip, Asteroid } from "ts/GameObjects/Space/SpaceObject";

export class AsteroidState implements IGameState {
// data objects
// data updaters
// graphic objects
// data to graphic binders
// graphic drawers

    //player : BasicShip;
    //objects : Array<IGameObject>;
    //asteroids : Array<Asteroid>;

    interactors: IInteractor[] = [];
    
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
        var objects: IGameObject[] = [field, text];
        var asteroids: Asteroid[] = [asteroid1];

        var asteroidState = new AsteroidState("Asteroids", ship, objects, asteroids);
        return asteroidState;
    }
    
    constructor(public name: string, private player : BasicShip, private objects : IGameObject[], private asteroids : Asteroid[]) {
        this.player = player;
        this.objects = objects;
        this.asteroids = asteroids;

        var asteroidBulletDetector = new Multi2MultiCollisionDetector(this.asteroidModels.bind(this), () => this.player.weaponModel.points, this.asteroidBulletHit.bind(this));
        var asteroidPlayerDetector = new Multi2ShapeCollisionDetector(this.asteroidModels.bind(this), this.player.model, this.asteroidPlayerHit.bind(this));
        this.interactors = [asteroidBulletDetector, asteroidPlayerDetector];
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
        if (keys.isKeyDown(Keys.UpArrow))
            this.player.thrust();
        else
            this.player.noThrust();
        if (keys.isKeyDown(Keys.LeftArrow)) this.player.left(lastDrawModifier);
        if (keys.isKeyDown(Keys.RightArrow)) this.player.right(lastDrawModifier);
        if (keys.isKeyDown(Keys.SpaceBar)) this.player.shootPrimary();
    }

    asteroidModels(): IShapeLocated[] {
        return this.asteroids.map(a => a.model);
    }

    asteroidBulletHit(i1: number, asteroids: AsteroidModel[], i2: number, bullets: ParticleModel[]) {
        // effect on asteroid
        
        let a = asteroids[i1];
        a.hit();
        // remove bullet
        bullets.splice(i2, 1);
        // add two small asteroids
        this.asteroids.push(this.createAsteroid(a.location));
        // TODO remove original;

    }

    asteroidPlayerHit(i1: number, asteroids: AsteroidModel[], i2: number, player: Coordinate[]) {
        this.player.crash();
    }

    tests() {
        this.interactors.forEach(i => i.test());
    }

    private createAsteroid(location : Coordinate) : Asteroid {
        return new Asteroid(new Coordinate(location.x, location.y), Math.random() * 5, Math.random() * 5,Math.random() * 360, Math.random() * 10);
    }
    
    returnState() : IGameState {
        return null;
    }

}
