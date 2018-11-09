import { IView } from "../../../gamelib/Views/View";
import { IActor } from "../../../gamelib/Actors/Actor";
import { IParticleGenInputs, AgePred } from "../../../gamelib/Actors/ParticleFieldUpdater";
import { ParticleRemover } from "../../../gamelib/Actors/ParticleRemover";
import { ParticleGenerator } from "../../../gamelib/Actors/ParticleGenerator";
import { MoveConstVelocity, IMoveOut } from "../../../gamelib/Actors/Movers";
import { SpriteAngledView } from "../../../gamelib/Views/Sprites/SpriteAngledView";
import { MultiGameObject } from "../../../gamelib/GameObjects/MultiGameObject";
import { SingleGameObject } from "../../../gamelib/GameObjects/SingleGameObject";
import { SpriteAnimator } from "../../../gamelib/Actors/SpriteAnimator";
import { Spinner } from "../../../gamelib/Actors/Spinner";
import { HorizontalSpriteSheet } from "../../../gamelib/DataTypes/Sprite";
import { ISpinningParticle } from "../Particle/ISpinningParticle";
// source
// generator Function
// remove
// sprite field
export function createSpriteField(): MultiGameObject<SingleGameObject> {
    let fieldModel: ISpinningParticle[] = [];
    let fieldArray: SingleGameObject[] = [];
    let get: () => IParticleGenInputs = () => {
        return {
            on: true
        };
    };
    let field: MultiGameObject<SingleGameObject> = new MultiGameObject<SingleGameObject>([], [], () => fieldArray);
    let generator: ParticleGenerator = new ParticleGenerator(get, (now: number) => {
        let p: ISpinningParticle = {
            x: 512 * Math.random(),
            y: 0,
            Vx: 0,
            Vy: 0,
            born: now,
            size: 1,
            spin: 45,
            angle: 10,
        };
        let mover: IActor = new MoveConstVelocity(() => {
            return {
                Vx: 0,
                Vy: 3,
            };
        }, (out: IMoveOut) => {
            p.x += out.dx;
            p.y += out.dy;
        });
        let sheet: HorizontalSpriteSheet = new HorizontalSpriteSheet("res/img/spinningCoin.png", 46, 42, 10, 0, 0.5, 0.5);
        let animator: IActor = new SpriteAnimator(sheet, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0.1]);
        let spinner: Spinner = new Spinner(() => {
            return { spin: p.spin };
        }, (sOut) => p.angle += sOut.dAngle);
        let view: IView = new SpriteAngledView(() => {
            return {
                x: p.x,
                y: p.y,
                angle: p.angle,
                sprite: sheet,
            };
        });
        let o: SingleGameObject = new SingleGameObject([mover, animator, spinner], [view]);
        fieldModel.push(p);
        field.getComponents().push(o);
    }, 1, 1, undefined);
    let age1: AgePred<ISpinningParticle> = new AgePred(() => 10, (p: ISpinningParticle) => p.born);
    let remover: ParticleRemover = new ParticleRemover(() => {
        ParticleRemover.remove(() => fieldModel, field.getComponents, [age1]);
    });
    // add the generator to the field object
    field.actors.push(generator, remover);
    return field;
}