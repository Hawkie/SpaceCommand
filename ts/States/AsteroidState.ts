import { DrawContext} from "ts/Common/DrawContext";

import { SparseArray } from "ts/Collections/SparseArray";
import { ParticleFieldData, ParticleData, MovingParticleModel, ParticleFieldModel } from "ts/Models/ParticleFieldModel";
import { IModel, MovingModel } from "ts/Models/DynamicModels";
import { AsteroidData, AsteroidModel } from "ts/Models/Space/Asteroid";
import { Rect } from "ts/DisplayObjects/DisplayObject";
import { Coordinate } from "ts/Physics/Common";
import { TextData } from "ts/Models/TextModel";
import { ILocated, IShapeLocated } from "ts/Models/PolyModels";
import { TextView } from "ts/Views/TextView";
import { IGameState } from "ts/States/GameState";
import { IInteractor } from "ts/Interactors/Interactor"
import { Multi2ShapeCollisionDetector, Multi2MultiCollisionDetector } from "ts/Interactors/CollisionDetector";

import { Keys, KeyStateProvider } from "ts/Common/KeyStateProvider";
import { IGameObject } from "ts/GameObjects/GameObject";
import { TextObject } from "ts/GameObjects/Common/BaseObjects";
import { ParticleField } from "ts/GameObjects/Common/ParticleField";
import { Asteroid } from "ts/GameObjects/Space/SpaceObject";
import { BasicShip } from "ts/GameObjects/Ships/SpaceShip";

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
        var pFieldData: ParticleFieldData = new ParticleFieldData(1);
        var pFieldModel: ParticleFieldModel = new ParticleFieldModel(pFieldData,
            (now: number) => new MovingParticleModel(new ParticleData(512 * Math.random(), 0, 0, 16, now)));
        var field: ParticleField = new ParticleField(pFieldModel,2, 2);
         

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

        var asteroidBulletDetector = new Multi2MultiCollisionDetector(this.asteroidModels.bind(this), this.bulletModels.bind(this), this.asteroidBulletHit.bind(this));
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
            this.player.model.thrust();
        else
            this.player.model.noThrust();
        if (keys.isKeyDown(Keys.LeftArrow)) this.player.model.left(lastDrawModifier);
        if (keys.isKeyDown(Keys.RightArrow)) this.player.model.right(lastDrawModifier);
        if (keys.isKeyDown(Keys.SpaceBar)) this.player.model.shootPrimary();
    }

    asteroidModels(): IModel<IShapeLocated>[] {
        return this.asteroids.map(a => a.model);
    }

    bulletModels(): IModel<ILocated>[] {
        return this.player.model.weaponModel.particles;
        }

    asteroidBulletHit(i1: number, asteroids: AsteroidModel[], i2: number, bullets: MovingParticleModel[]) {
        // effect on asteroid
        
        let a = asteroids[i1];
        a.data.hit();
        // remove bullet
        bullets.splice(i2, 1);
        // add two small asteroids
        this.asteroids.push(this.createAsteroid(a.data.location));
        // TODO remove original;

    }

    asteroidPlayerHit(i1: number, asteroids: AsteroidData[], i2: number, player: Coordinate[]) {
        this.player.model.crash();
    }

    tests(lastTestModifier: number) {
        this.interactors.forEach(i => i.test(lastTestModifier));
    }

    private createAsteroid(location : Coordinate) : Asteroid {
        return new Asteroid(new Coordinate(location.x, location.y), Math.random() * 5, Math.random() * 5,Math.random() * 360, Math.random() * 10);
    }
    
    returnState() : IGameState {
        return null;
    }

}
