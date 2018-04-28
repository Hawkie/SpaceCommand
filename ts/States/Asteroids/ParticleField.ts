﻿import { DrawContext } from "ts/Common/DrawContext";
import { IView } from "ts/gamelib/Views/View";
import { IActor } from "ts/gamelib/Actors/Actor";
import { IParticleGenInputs, ParticleGenerator,
    ParticleRemover, PredGreaterThan, AgePred } from "ts/gamelib/Actors/ParticleFieldUpdater";
import { MoveConstVelocity, IMoveOut } from "ts/gamelib/Actors/Movers";
import { Accelerator, IAcceleratorInputs, IAcceleratorOutputs } from "ts/gamelib/Actors/Accelerator";
import { CircleView, RectangleView } from "ts/gamelib/Views/PolyViews";
import { TextView } from "ts/gamelib/Views/TextView";
import { SpriteView, SpriteAngledView } from "ts/gamelib/Views/SpriteView";
import { Coordinate } from "ts/gamelib/Data/Coordinate";
import { IGameObject, SingleGameObject, MultiGameObject, ComponentObjects } from "ts/GameObjects/GameObject";
import { SpriteAnimator } from "ts/gamelib/Actors/SpriteAnimator";
import { Spinner } from "ts/gamelib/Actors/Rotators";
import { ISprite, HorizontalSpriteSheet } from "ts/gamelib/Data/Sprite";
import { Transforms } from "ts/Physics/Transforms";
import { IExhaust, IExplosion } from "ts/States/Asteroids/AsteroidModels";
import { Vector, IVector } from "ts/gamelib/Data/Vector";

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

export interface IExplosionInputs {
    x: number;
    y: number;
    gravityOn: boolean;
}

export interface IThrustInputs {
    x: number;
    y: number;
    thrust: IVector;
    xOffset: number;
    yOffset: number;
    gravityOn: boolean;
}

export interface IFieldInputs {
    x: number;
    y: number;
    Vx: number;
    Vy: number;
    thrust: Vector;
    xOffset: number;
    yOffset: number;
    gravityOn: boolean;
    size: number;
}

// particlefield inputs
// source
// generator Function
// remove
export class Field {

    // new field with simpler inputs and setter.
    static createBackgroundField(speed: number, size: number):  MultiGameObject<IParticleGenInputs, SingleGameObject<IParticle>> {
        var fieldArray: SingleGameObject<IParticle>[] = [];

        // todo: change class to remove null later
        let field: MultiGameObject<null,SingleGameObject<IParticle>> = new MultiGameObject<null, SingleGameObject<IParticle>>(
            null, [], [], ()=>fieldArray);

        var particleGenInputs: IParticleGenInputs = {
            on: ()=>true,
            itemsPerSec: 1,
            maxGeneratedPerIteration: 1,
            generationTimeInSec: undefined,
        };
        var generator: ParticleGenerator = new ParticleGenerator(
            ()=> { return particleGenInputs; },
            (now: number) => {
                var p: IParticle = {
                    x: 512 * Math.random(),
                    y: 0,
                    Vx: 0,
                    Vy: speed,
                    born: now,
                    size: size,
                };
                var mover: IActor = new MoveConstVelocity(
                    () => p,
                    (out: IMoveOut) => {
                        p.x += out.dx;
                        p.y += out.dy;
                    }
                );
                var view: IView = new RectangleView(() => { return {
                    x: p.x,
                    y: p.y,
                    width: p.size,
                    height: p.size,
                };});
                var newParticle: SingleGameObject<IParticle> = new SingleGameObject<IParticle>(()=>p, [mover], [view]);
            field.getComponents().push(newParticle);
        });
        var age1: AgePred<SingleGameObject<IParticle>> = new AgePred(()=>5, (p: SingleGameObject<IParticle>)=> p.model().born);
        var edge1:PredGreaterThan<SingleGameObject<IParticle>>
        = new PredGreaterThan(()=>700, (p: SingleGameObject<IParticle>)=> p.model().y);
        var remover: ParticleRemover<SingleGameObject<IParticle>> = new ParticleRemover<SingleGameObject<IParticle>>(
            () => {
                ParticleRemover.remove(
                    field.getComponents,
                    [edge1]);});
        // add the generator to the field object
        field.actors.push(generator, remover);
        return field;
    }

    static createExplosion(explosion: ()=>IExplosion,
        inputs: ()=> IExplosionInputs): MultiGameObject<IParticleGenInputs, SingleGameObject<IParticle>> {
        var fieldArray: SingleGameObject<IParticle>[] = [];

        var particleGenInputs: IParticleGenInputs = {
            on: ()=>explosion().on,
            itemsPerSec: explosion().particlesPerSecond,
            maxGeneratedPerIteration: 50,
            generationTimeInSec: 0.2,
        };
        // todo: change class to remove null later
        var field: MultiGameObject<IParticleGenInputs,SingleGameObject<IParticle>> =
            new MultiGameObject<IParticleGenInputs, SingleGameObject<IParticle>>(
            ()=>particleGenInputs, [], [], ()=>fieldArray);

        var generator: ParticleGenerator = new ParticleGenerator(field.model,
            (now: number) => {
                var source: IExplosionInputs = inputs();
                var p: IParticle = {
                    x: source.x,
                    y: source.y,
                    Vx: (Math.random() - 0.5) * 20,
                    Vy: (Math.random() * -30),
                    born: now,
                    size: explosion().particleSize,
                };
                var mover: IActor = new MoveConstVelocity(
                    () => p,
                    (out: IMoveOut) => {
                        p.x += out.dx;
                        p.y += out.dy;
                    }
                );
                var view:IView = new RectangleView(()=> { return {
                    x: p.x,
                    y: p.y,
                    width: p.size,
                    height: p.size,
                };});
                var newParticle: SingleGameObject<IParticle> =  new SingleGameObject<IParticle>(()=>p, [mover], [view]);
                if (source.gravityOn) {
                    var getAcceleratorProps: () => IAcceleratorInputs = () => {
                        return {
                            x: p.x,
                            y: p.y,
                            Vx: p.Vx,
                            Vy: p.Vy,
                            forces: [new Vector(180, 1)],
                            mass: 0.1
                        };
                    };
                    var gravity: Accelerator = new Accelerator(getAcceleratorProps, (out: IAcceleratorOutputs)=> {
                        p.Vx += out.dVx;
                        p.Vy += out.dVy;
                    });
                    newParticle.actors.push(gravity);
                }
                field.getComponents().push(newParticle);
            });
            var age1: AgePred<SingleGameObject<IParticle>> = new AgePred(()=>5, (p: SingleGameObject<IParticle>)=> p.model().born);
            var remover: ParticleRemover<SingleGameObject<IParticle>> = new ParticleRemover<SingleGameObject<IParticle>>(
                () => {
                    ParticleRemover.remove(
                        field.getComponents,
                        [age1]);});
            // add the generator to the field object
            field.actors.push(generator, remover);
        return field;
    }

    static createExhaustObj(getExhaust: ()=>IExhaust,
        getInputs: ()=> IThrustInputs): MultiGameObject<IParticleGenInputs, SingleGameObject<IParticle>> {
        let fieldArray: SingleGameObject<IParticle>[] = [];
        var exhaust: IExhaust = getExhaust();

        var particleGenInputs: IParticleGenInputs = {
            on: ()=>exhaust.on,
            itemsPerSec: exhaust.particlesPerSecond,
            maxGeneratedPerIteration: 50,
            generationTimeInSec: undefined,
        };

        var field: MultiGameObject<IParticleGenInputs,SingleGameObject<IParticle>> =
            new MultiGameObject<IParticleGenInputs, SingleGameObject<IParticle>>(
                ()=>particleGenInputs, [], [], ()=>fieldArray);

        var generator: ParticleGenerator = new ParticleGenerator(
            ()=>particleGenInputs,
            (now: number) => {
                var source: IThrustInputs = getInputs();
                var velocity: Coordinate = Transforms.VectorToCartesian(source.thrust.angle + Transforms.random(-5, 5) + 180,
                source.thrust.length * 5 + Transforms.random(-5, 5));
                var p: IParticle = {
                    x: source.x + source.xOffset + Transforms.random(-2, 2),
                    y: source.y + source.yOffset + Transforms.random(-2, 2),
                    Vx: velocity.x,
                    Vy: velocity.y,
                    born: now,
                    size: 1,
                };
                var mover: IActor = new MoveConstVelocity(() => { return {
                    Vx: p.Vx,
                    Vy: p.Vy,
                };},
                (out: IMoveOut)=> {
                    p.x += out.dx;
                    p.y += out.dy;
                });
                var view:IView = new RectangleView(()=> { return {
                    x: p.x,
                    y: p.y,
                    width: p.size,
                    height: p.size,
                };});
                var newParticle: SingleGameObject<IParticle> =  new SingleGameObject<IParticle>(()=>p, [mover], [view]);

            if (source.gravityOn) {
                var getAcceleratorProps: () => IAcceleratorInputs = () => {
                    return {
                        x: p.x,
                        y: p.y,
                        Vx: p.Vx,
                        Vy: p.Vy,
                        forces: [new Vector(180, 1)],
                        mass: 0.1
                    };
                };
                var gravity: Accelerator = new Accelerator(getAcceleratorProps, (out: IAcceleratorOutputs)=> {
                    p.Vx += out.dVx;
                    p.Vy += out.dVy;
                });
                newParticle.actors.push(gravity);
            }
            field.getComponents().push(newParticle);
        });
        var age1: AgePred<SingleGameObject<IParticle>> = new AgePred(()=>exhaust.particleLifetime,
            (p: SingleGameObject<IParticle>)=> p.model().born);
            var remover: ParticleRemover<SingleGameObject<IParticle>> = new ParticleRemover<SingleGameObject<IParticle>>(
                () => {
                    ParticleRemover.remove(
                        field.getComponents,
                        [age1]);});
            // add the generator to the field object
            field.actors.push(generator, remover);
        return field;
    }

    // sprite field
    static createSpriteField(): MultiGameObject<IParticleGenInputs, SingleGameObject<ISpinningParticle>> {

        let fieldArray: SingleGameObject<ISpinningParticle>[] = [];
        var particleGenInputs: IParticleGenInputs = {
            on: ()=>true,
            itemsPerSec: 1,
            maxGeneratedPerIteration: 1,
            generationTimeInSec: undefined,
        };

        var field: MultiGameObject<IParticleGenInputs,SingleGameObject<ISpinningParticle>> =
            new MultiGameObject<IParticleGenInputs, SingleGameObject<ISpinningParticle>>(
            ()=>particleGenInputs, [], [], ()=>fieldArray);

        var generator: ParticleGenerator = new ParticleGenerator(
            field.model,
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
            var o: SingleGameObject<ISpinningParticle> = new SingleGameObject(()=>p, [mover, animator, spinner], [view]);
            field.getComponents().push(o);
        });
        var age1: AgePred<SingleGameObject<IParticle>> = new AgePred(()=>10, (p: SingleGameObject<IParticle>)=> p.model().born);
            var remover: ParticleRemover<SingleGameObject<IParticle>> = new ParticleRemover<SingleGameObject<IParticle>>(
                () => {
                    ParticleRemover.remove(
                        field.getComponents,
                        [age1]);});
            // add the generator to the field object
            field.actors.push(generator, remover);
        return field;
    }
}
