import { IView } from "ts/gamelib/Views/View";
import { IActor } from "ts/gamelib/Actors/Actor";
import { IParticleGenInputs, ParticleGenerator,
    ParticleRemover, PredGreaterThan, AgePred, IParticleGenInputs2, ParticleGenerator2 } from "ts/gamelib/Actors/ParticleFieldUpdater";
import { MoveConstVelocity, IMoveOut } from "ts/gamelib/Actors/Movers";
import { Accelerator, IAcceleratorInputs, IAcceleratorOutputs } from "ts/gamelib/Actors/Accelerator";
import { RectangleView } from "ts/gamelib/Views/RectangleView";
import { CircleView } from "ts/gamelib/Views/CircleView";
import { TextView } from "ts/gamelib/Views/TextView";
import { SpriteView, SpriteAngledView } from "ts/gamelib/Views/SpriteView";
import { Coordinate } from "ts/gamelib/Data/Coordinate";
import { IGameObject, SingleGameObject, MultiGameObject } from "ts/gamelib/GameObjects/GameObject";
import { SpriteAnimator } from "ts/gamelib/Actors/SpriteAnimator";
import { Spinner } from "ts/gamelib/Actors/Rotators";
import { ISprite, HorizontalSpriteSheet } from "ts/gamelib/Data/Sprite";
import { Transforms } from "ts/gamelib/Physics/Transforms";
import { IParticleField } from "ts/States/Asteroids/AsteroidModels";
import { Vector, IVector } from "ts/gamelib/Data/Vector";
import { addGravity } from "../Shared/Gravity";

export interface IParticle {
    x: number;
    y: number;
    Vx: number;
    Vy: number;
    born: number;
    size: number;
}

export interface ISpinningParticle extends IParticle {
    spin: number;
    angle: number;
}

export interface IFieldInputs {
    on: boolean;
    x: number;
    xOffset: number;
    xLowSpread: number;
    xHighSpread: number;
    y: number;
    yOffset: number;
    yLowSpread: number;
    yHighSpread: number;
    Vx: number;
    vXLowSpread: number;
    vXHighSpread: number;
    Vy: number;
    vYLowSpread: number;
    vYHighSpread: number;
}

export function createParticleField(particleField: IParticleField,
    fieldInputs: ()=>IFieldInputs,): MultiGameObject<SingleGameObject> {

    var fieldArray: SingleGameObject[] = [];
    // todo: change class to remove null later
    var field: MultiGameObject<SingleGameObject> =
        new MultiGameObject<SingleGameObject>([], [], ()=>fieldArray);

    var generator: ParticleGenerator2 = new ParticleGenerator2(fieldInputs,
        particleField.particlesPerSecond,
        particleField.maxParticlesPerSecond,
        (now: number) => {
            var source: IFieldInputs = fieldInputs();
            var p: IParticle = {
                x: source.x + source.xOffset + Transforms.random(source.xLowSpread, source.xHighSpread),
                y: source.y + source.yOffset + Transforms.random(source.yLowSpread, source.yHighSpread),
                Vx: source.Vx + Transforms.random(source.vXLowSpread, source.vXHighSpread),
                Vy: source.Vy + Transforms.random(source.vYLowSpread, source.vYHighSpread),
                born: now,
                size: particleField.particleSize,
            };
            var newParticle: SingleGameObject = createParticleObject(p);
            if (particleField.gravityStrength !== 0) {
                var getAcceleratorProps: () => IAcceleratorInputs = () => {
                    return {
                        x: p.x,
                        y: p.y,
                        Vx: p.Vx,
                        Vy: p.Vy,
                        forces: [new Vector(180, particleField.gravityStrength)],
                        mass: 1,
                    };
                };
                var gravity: Accelerator = new Accelerator(getAcceleratorProps, (out: IAcceleratorOutputs) => {
                    p.Vx += out.dVx;
                    p.Vy += out.dVy;
                });
                newParticle.actors.push(gravity);
            }
            particleField.particles.push(p);
            field.getComponents().push(newParticle);
        });
        var age1: AgePred<IParticle> = new AgePred(()=>particleField.particleLifetime, (p: IParticle)=> p.born);
        var remover: ParticleRemover = new ParticleRemover(
            () => {
                ParticleRemover.remove(
                    ()=>particleField.particles,
                    field.getComponents,
                    [age1]);});
        // add the generator to the field object
        field.actors.push(generator, remover);
    return field;
}

// source
// generator Function
// remove
export class AsteroidFields {

    // sprite field
    static createSpriteField(): MultiGameObject<SingleGameObject> {
        let fieldModel: ISpinningParticle[] = [];
        let fieldArray: SingleGameObject[] = [];
        var get: () => IParticleGenInputs = () => { return {
            on: true
        };};

        var field: MultiGameObject<SingleGameObject> =
            new MultiGameObject<SingleGameObject>([], [], ()=>fieldArray);

        var generator: ParticleGenerator = new ParticleGenerator(
            get,
            (now: number) => {
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
                var mover:IActor = new MoveConstVelocity(() => {
                    return {
                        Vx: 0,
                        Vy: 3,
                };},
                (out: IMoveOut)=> {
                    p.x += out.dx;
                    p.y += out.dy;
                });
                var sheet: HorizontalSpriteSheet = new HorizontalSpriteSheet("res/img/spinningCoin.png", 46, 42, 10, 0, 0.5, 0.5);
                var animator: IActor = new SpriteAnimator(sheet, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0.1]);
                var spinner: Spinner = new Spinner(() => {
                    return {spin:p.spin};
                }, (sOut)=> p.angle+= sOut.dAngle);
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
        },
        1,
        1,
        undefined);
        var age1: AgePred<ISpinningParticle> = new AgePred(()=>10, (p: ISpinningParticle)=> p.born);
            var remover: ParticleRemover = new ParticleRemover(
                () => {
                    ParticleRemover.remove(
                        ()=>fieldModel,
                        field.getComponents,
                        [age1]);});
            // add the generator to the field object
            field.actors.push(generator, remover);
        return field;
    }
}

function createParticleObject(p: IParticle): SingleGameObject {
    var mover: IActor = new MoveConstVelocity(() => {
        return {
            Vx: p.Vx,
            Vy: p.Vy,
        };
    }, (out: IMoveOut) => {
        p.x += out.dx;
        p.y += out.dy;
    });
    var view: IView = new RectangleView(() => {
        return {
            x: p.x,
            y: p.y,
            width: p.size,
            height: p.size,
        };
    });
    var newParticle: SingleGameObject = new SingleGameObject([mover], [view]);
    return newParticle;
}

