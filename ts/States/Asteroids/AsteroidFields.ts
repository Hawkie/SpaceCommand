import { DrawContext } from "ts/gamelib/Common/DrawContext";
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
import { IGameObject, SingleGameObject, MultiGameObject } from "ts/gamelib/GameObjects/GameObject";
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

// source
// generator Function
// remove
export class AsteroidFields {

    // new field with simpler inputs and setter.
    static createBackgroundField(speed: number, size: number):  MultiGameObject<SingleGameObject> {
        var fieldModel: IParticle[] = [];
        var fieldArray: SingleGameObject[] = [];

        // todo: change class to remove null later
        let field: MultiGameObject<SingleGameObject> = new MultiGameObject<SingleGameObject>(
            [], [], ()=>fieldArray);

        var get: () => IParticleGenInputs = ()=> { return {
                on: true,
                itemsPerSec: 1,
                maxGeneratedPerIteration: 1,
                generationTimeInSec: undefined,
            };
        };
        var generator: ParticleGenerator = new ParticleGenerator(
            get,
            (now: number) => {
                var p: IParticle = {
                    x: 512 * Math.random(),
                    y: 0,
                    Vx: 0,
                    Vy: speed,
                    born: now,
                    size: size,
                };
                var newParticle: SingleGameObject = createParticleObject(p);
                field.getComponents().push(newParticle);
                fieldModel.push(p);
            }
        );
        var age5: AgePred<IParticle> = new AgePred(()=>5, (p: IParticle)=> p.born);
        var edge1:PredGreaterThan<IParticle> = new PredGreaterThan(()=>700, (p: IParticle)=> p.y);
        var remover: ParticleRemover = new ParticleRemover(
            () => {
                ParticleRemover.remove(
                    ()=>fieldModel,
                    field.getComponents,
                    [edge1]);
                });
        // add the generator to the field object
        field.actors.push(generator, remover);
        return field;
    }

    static createExplosion(explosion: ()=>IExplosion,
        inputs: ()=> IExplosionInputs): MultiGameObject<SingleGameObject> {
        var fieldArray: SingleGameObject[] = [];

        var get: () => IParticleGenInputs = ()=> { return {
            on: explosion().on,
            itemsPerSec: explosion().particlesPerSecond,
            maxGeneratedPerIteration: 50,
            generationTimeInSec: 0.2,
        };};
        // todo: change class to remove null later
        var field: MultiGameObject<SingleGameObject> =
            new MultiGameObject<SingleGameObject>([], [], ()=>fieldArray);

        var generator: ParticleGenerator = new ParticleGenerator(get,
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
                var newParticle: SingleGameObject = createParticleObject(p);
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
                explosion().particles.push(p);
                field.getComponents().push(newParticle);
            });
            var age1: AgePred<IParticle> = new AgePred(()=>5, (p: IParticle)=> p.born);
            var remover: ParticleRemover = new ParticleRemover(
                () => {
                    ParticleRemover.remove(
                        ()=>explosion().particles,
                        field.getComponents,
                        [age1]);});
            // add the generator to the field object
            field.actors.push(generator, remover);
        return field;
    }

    static createExhaustObj(getExhaust: ()=>IExhaust,
        getInputs: ()=> IThrustInputs): MultiGameObject<SingleGameObject> {
        let fieldArray: SingleGameObject[] = [];
        var exhaust: IExhaust = getExhaust();

        var get: () => IParticleGenInputs = ()=> { return {
            on: exhaust.on,
            itemsPerSec: exhaust.particlesPerSecond,
            maxGeneratedPerIteration: 50,
            generationTimeInSec: undefined,
        };};

        var field: MultiGameObject<SingleGameObject> =
            new MultiGameObject<SingleGameObject>([], [], ()=>fieldArray);

        var generator: ParticleGenerator = new ParticleGenerator(
            get,
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
                var newParticle: SingleGameObject = createParticleObject(p);
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
            exhaust.particles.items.push(p);
            field.getComponents().push(newParticle);
        });
        var age1: AgePred<IParticle> = new AgePred(()=>exhaust.particleLifetime,
            (p: IParticle)=> p.born);
            var remover: ParticleRemover = new ParticleRemover(
                () => {
                    ParticleRemover.remove(
                        ()=>getExhaust().particles.items,
                        field.getComponents,
                        [age1]);
                    });
        // add the generator to the field object
        // var syncer: IActor = new Syncer(()=> exhaust.particles, field.getComponents(), createParticleObject);
        field.actors.push(generator, remover);
        return field;
    }

    // sprite field
    static createSpriteField(): MultiGameObject<SingleGameObject> {
        let fieldModel: ISpinningParticle[] = [];
        let fieldArray: SingleGameObject[] = [];
        var get: () => IParticleGenInputs = ()=> { return {
            on: true,
            itemsPerSec: 1,
            maxGeneratedPerIteration: 1,
            generationTimeInSec: undefined,
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
        });
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

