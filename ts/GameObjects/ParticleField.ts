import { DrawContext } from "ts/Common/DrawContext";
import { IView } from "ts/Views/View";
import { IActor } from "ts/Actors/Actor";
import { ParticleGenerator, ParticleRemover } from "ts/Actors/ParticleFieldUpdater";
import { Mover } from "ts/Actors/Movers";
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { RectangleData } from "ts/Data/ShapeData";
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
import { RectangleView } from "ts/Views/PolyViews";
import { SpriteView } from "ts/Views/SpriteView";
import { Coordinate, Vector } from "ts/Physics/Common";
import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { ILocated, LocatedData, LocatedMovingAngledRotatingData, LocatedMovingAngledRotatingForwardAccData  } from "ts/Data/PhysicsData";
import { SpriteAnimator } from "ts/Actors/SpriteAnimator";
import { Spinner } from "ts/Actors/Rotators";
import { ISprite, HorizontalSpriteSheet } from "ts/Data/SpriteData";

export class Field<TField, TParticle> implements IGameObject {
    
    constructor(public fieldData: TField, public field: GameObject<TParticle>[], public actors:IActor[]) { }

    update(timeModifier: number) {
        this.actors.forEach(a => a.update(timeModifier));
        this.field.forEach(p => p.update(timeModifier));
    }

    display(drawContext: DrawContext) {
        this.field.forEach(p => p.display(drawContext));
    }

    // simple rectangle field scrolling down
    static createBackgroundField(speed:number, size:number) : Field<ParticleFieldData, ParticleData> {
        let fieldData: ParticleFieldData = new ParticleFieldData(1);
        let field: GameObject<ParticleData>[] = [];
        var generator: ParticleGenerator = new ParticleGenerator(fieldData, field, (now: number) => {
                var p = new ParticleData(512 * Math.random(), 0, 0, speed, now);
                var mover = new Mover(p);
                var view = new RectangleView(p, new RectangleData(size, size));
                return new GameObject<ParticleData>(p, [mover], [view]);
            });
        var remover: ParticleRemover = new ParticleRemover(fieldData, field);
        
        var fieldObj: Field<ParticleFieldData, ParticleData> = new Field<ParticleFieldData, ParticleData>(fieldData, field, [generator, remover]);
        return fieldObj;
    }

    // sprite field
    static createSpriteField(): Field<ParticleFieldData, ParticleData> {
        let fieldData: ParticleFieldData = new ParticleFieldData(1);
        let field: GameObject<ParticleData>[] = [];
        var generator: ParticleGenerator = new ParticleGenerator(fieldData, field, (now: number) => {
            var p = new ParticleData(512 * Math.random(), 0, 0, 16, now);
            var mover = new Mover(p);
            var l = new LocatedMovingAngledRotatingData(p.location, 0, 0, 45, 4);
            var s = new HorizontalSpriteSheet("res/img/spinningCoin.png", 46, 42, 10, 0, 0.5, 0.5);
            var a = new SpriteAnimator(s, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0.1]);
            var spinner = new Spinner(l);

            var view = new SpriteView(p, s);
            return new GameObject<ParticleData>(p, [mover], [view]);
        });
        var mover: ParticleRemover = new ParticleRemover(fieldData, field);

        var fieldObj: Field<ParticleFieldData, ParticleData> = new Field<ParticleFieldData, ParticleData>(fieldData, field, [generator, mover]);
        return fieldObj;
    }
}
