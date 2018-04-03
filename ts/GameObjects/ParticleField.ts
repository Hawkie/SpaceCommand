import { DrawContext } from "ts/Common/DrawContext";
import { IView } from "ts/Views/View";
import { IActor } from "ts/Actors/Actor";
import { ParticleGenerator, ParticleRemover } from "ts/Actors/ParticleFieldUpdater";
import { Mover } from "ts/Actors/Movers";
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { RectangleData, CircleData } from "ts/Data/ShapeData";
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
import { RectangleView, CircleView } from "ts/Views/PolyViews";
import { TextView } from "ts/Views/TextView";
import { SpriteView, SpriteAngledView } from "ts/Views/SpriteView";
import { Coordinate, Vector } from "ts/Physics/Common";
import { IGameObject, SingleGameObject, MultiGameObject } from "ts/GameObjects/GameObject";
import { ILocated, LocatedData, LocatedMovingAngledRotatingData, LocatedMovingAngledRotatingForces  } from "ts/Data/PhysicsData";
import { SpriteAnimator } from "ts/Actors/SpriteAnimator";
import { Spinner } from "ts/Actors/Rotators";
import { ISprite, HorizontalSpriteSheet } from "ts/Data/SpriteData";

export class Field {

    // simple rectangle field scrolling down
    static createBackgroundField(speed:number, size:number): MultiGameObject<ParticleFieldData, SingleGameObject<ParticleData>> {
        let fieldData: ParticleFieldData = new ParticleFieldData(1, 1);
        let field: SingleGameObject<ParticleData>[] = [];
        var generator: ParticleGenerator = new ParticleGenerator(fieldData, field, (now: number) => {
                var p = new ParticleData(512 * Math.random(), 0, 0, speed, 0, 0, now);
                var mover = new Mover(p);
                var view = new RectangleView(p, new RectangleData(size, size));
                // var view = new CircleView(p, new CircleData(size));
                return new SingleGameObject<ParticleData>(p, [mover], [view]);
            });
        var mover: ParticleRemover = new ParticleRemover(fieldData, field);
        var fieldObj = new MultiGameObject(fieldData, [generator, mover], [], field);
        return fieldObj;
    }

    // sprite field
    static createSpriteField(): MultiGameObject<ParticleFieldData, SingleGameObject<ParticleData>> {
        let fieldData: ParticleFieldData = new ParticleFieldData(1, 1);
        let particles: SingleGameObject<ParticleData>[] = [];
        var generator: ParticleGenerator = new ParticleGenerator(fieldData, particles, (now: number) => {
            var particle = new ParticleData(512 * Math.random(), 0, 0, 16, 45, 4, now);
            var mover = new Mover(particle);
            var sheet = new HorizontalSpriteSheet("res/img/spinningCoin.png", 46, 42, 10, 0, 0.5, 0.5);
            var animator = new SpriteAnimator(sheet, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0.1]);
            var spinner = new Spinner(particle);
            var view = new SpriteAngledView(particle, sheet);
            return new SingleGameObject(particle, [mover, animator, spinner], [view]);
        });
        var remover: ParticleRemover = new ParticleRemover(fieldData, particles);

        var fieldObj = new MultiGameObject(fieldData, [generator, remover], [], particles);
        return fieldObj;
    }
}
