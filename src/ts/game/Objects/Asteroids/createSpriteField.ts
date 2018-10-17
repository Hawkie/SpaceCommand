import { IView } from "ts/gamelib/Views/View";
import { IActor } from "ts/gamelib/Actors/Actor";
import { IParticleGenInputs, AgePred } from "ts/gamelib/Actors/ParticleFieldUpdater";
import { ParticleRemover } from "ts/gamelib/Actors/ParticleRemover";
import { ParticleGenerator } from "ts/gamelib/Actors/ParticleGenerator";
import { MoveConstVelocity, IMoveOut } from "ts/gamelib/Actors/Movers";
import { SpriteAngledView } from "ts/gamelib/Views/Sprites/SpriteAngledView";
import { MultiGameObject } from "ts/gamelib/GameObjects/MultiGameObject";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
import { SpriteAnimator } from "ts/gamelib/Actors/SpriteAnimator";
import { Spinner } from "ts/gamelib/Actors/Spinner";
import { HorizontalSpriteSheet } from "ts/gamelib/DataTypes/Sprite";
import { ISpinningParticle } from "../Particle/ISpinningParticle";
// source
// generator Function
// remove
// sprite field
export function createSpriteField(): MultiGameObject<SingleGameObject> {
    let fieldModel: ISpinningParticle[] = [];
    let fieldArray: SingleGameObject[] = [];
    var get: () => IParticleGenInputs = () => {
        return {
            on: true
        };
    };
    var field: MultiGameObject<SingleGameObject> = new MultiGameObject<SingleGameObject>([], [], () => fieldArray);
    var generator: ParticleGenerator = new ParticleGenerator(get, (now: number) => {
        var p: ISpinningParticle = {
            x: 512 * Math.random(),
            y: 0,
            Vx: 0,
            Vy: 0,
            born: now,
            size: 1,
            spin: 45,
            angle: 10,
        };
        var mover: IActor = new MoveConstVelocity(() => {
            return {
                Vx: 0,
                Vy: 3,
            };
        }, (out: IMoveOut) => {
            p.x += out.dx;
            p.y += out.dy;
        });
        var sheet: HorizontalSpriteSheet = new HorizontalSpriteSheet("res/img/spinningCoin.png", 46, 42, 10, 0, 0.5, 0.5);
        var animator: IActor = new SpriteAnimator(sheet, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0.1]);
        var spinner: Spinner = new Spinner(() => {
            return { spin: p.spin };
        }, (sOut) => p.angle += sOut.dAngle);
        var view: IView = new SpriteAngledView(() => {
            return {
                x: p.x,
                y: p.y,
                angle: p.angle,
                sprite: sheet,
            };
        });
        var o: SingleGameObject = new SingleGameObject([mover, animator, spinner], [view]);
        fieldModel.push(p);
        field.getComponents().push(o);
    }, 1, 1, undefined);
    var age1: AgePred<ISpinningParticle> = new AgePred(() => 10, (p: ISpinningParticle) => p.born);
    var remover: ParticleRemover = new ParticleRemover(() => {
        ParticleRemover.remove(() => fieldModel, field.getComponents, [age1]);
    });
    // add the generator to the field object
    field.actors.push(generator, remover);
    return field;
}