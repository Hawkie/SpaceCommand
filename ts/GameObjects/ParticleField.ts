import { DrawContext } from "ts/Common/DrawContext";
import { IView } from "ts/Views/View";
import { IActor } from "ts/Actors/Actor";
import { ParticleGenerator, ParticleRemover,
    IParticleGenInputs, ParticleGenerator2,
    ParticleRemover2, PredGreaterThan, AgePred } from "ts/Actors/ParticleFieldUpdater";
import { Mover, MoveConstVelocity, IMoveOut } from "ts/Actors/Movers";
import { Accelerator, IAcceleratorInputs, IAcceleratorOutputs } from "ts/Actors/Accelerator";
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
import { CircleView, RectangleView } from "ts/Views/PolyViews";
import { TextView } from "ts/Views/TextView";
import { SpriteView, SpriteAngledView } from "ts/Views/SpriteView";
import { Coordinate, Vector } from "ts/Physics/Common";
import { IGameObject, SingleGameObject, MultiGameObject, IComponentObjects, ComponentObjects } from "ts/GameObjects/GameObject";
import { ILocated, LocatedData, LocatedMovingAngledRotatingData, LocatedMovingAngledRotatingForces  } from "ts/Data/PhysicsData";
import { SpriteAnimator } from "ts/Actors/SpriteAnimator";
import { Spinner } from "ts/Actors/Rotators";
import { ISprite, HorizontalSpriteSheet } from "ts/Data/SpriteData";

export interface IParticle {
    x: number;
    y: number;
    Vx: number;
    Vy: number;
    born: number;
    size: number;
}

export interface IExplosionInputs {
    x: number;
    y: number;
    gravityOn: boolean;
}

export class Field {

    // new field with simpler inputs and setter.
    static createBackgroundField(speed: number, size: number):  MultiGameObject<IParticleGenInputs, SingleGameObject<IParticle>> {
        var fieldArray: SingleGameObject<IParticle>[] = [];

        // todo: change class to remove null later
        let field: MultiGameObject<null,SingleGameObject<IParticle>> = new MultiGameObject<null, SingleGameObject<IParticle>>(
            null, [], [], fieldArray);

        var particleGenInputs: IParticleGenInputs = {
            on: true,
            itemsPerSec: 1,
            maxGeneratedPerIteration: 1,
            generationTimeInSec: undefined,
        };
        var generator: ParticleGenerator2 = new ParticleGenerator2(
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
                    width: size,
                    height: size,
                };});
                var newParticle: SingleGameObject<IParticle> = new SingleGameObject<IParticle>(p, [mover], [view]);
            field.components.push(newParticle);
        });
        var age1: AgePred<SingleGameObject<IParticle>> = new AgePred(()=>5, (p: SingleGameObject<IParticle>)=> p.model.born);
        var edge1:PredGreaterThan<SingleGameObject<IParticle>> = new PredGreaterThan(()=>700, (p: SingleGameObject<IParticle>)=> p.model.y);
        var remover: ParticleRemover2<SingleGameObject<IParticle>> = new ParticleRemover2<SingleGameObject<IParticle>>(
            () => {
                ParticleRemover2.remove(
                    () => field.components,
                    [edge1]);});
        // add the generator to the field object
        field.actors.push(generator, remover);
        return field;
    }

    static createExplosion(inputs: ()=> IExplosionInputs): MultiGameObject<IParticleGenInputs, SingleGameObject<IParticle>> {
        var fieldArray: SingleGameObject<IParticle>[] = [];

        var particleGenInputs: IParticleGenInputs = {
            on: false,
            itemsPerSec: 50,
            maxGeneratedPerIteration: undefined,
            generationTimeInSec: 0.2,
        };
        // todo: change class to remove null later
        var field: MultiGameObject<IParticleGenInputs,SingleGameObject<IParticle>> =
            new MultiGameObject<IParticleGenInputs, SingleGameObject<IParticle>>(
            particleGenInputs, [], [], fieldArray);

        // let fieldData: ParticleFieldData = new ParticleFieldData(50, undefined, 5, 0.2, false);
        var generator: ParticleGenerator2 = new ParticleGenerator2(() => {
            return field.model; },
            (now: number) => {
                var source: IExplosionInputs = inputs();
                var p: IParticle = {
                    x: source.x,
                    y: source.y,
                    Vx: (Math.random() - 0.5) * 20,
                    Vy: (Math.random() * -30),
                    born: now,
                    size: 3,
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
                    width: 3,
                    height: 3,
                };});
                var newParticle: SingleGameObject<IParticle> =  new SingleGameObject<IParticle>(p, [mover], [view]);
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
                field.components.push(newParticle);
            });
            var age1: AgePred<SingleGameObject<IParticle>> = new AgePred(()=>5, (p: SingleGameObject<IParticle>)=> p.model.born);
            var remover: ParticleRemover2<SingleGameObject<IParticle>> = new ParticleRemover2<SingleGameObject<IParticle>>(
                () => {
                    ParticleRemover2.remove(
                        () => field.components,
                        [age1]);});
            // add the generator to the field object
            field.actors.push(generator, remover);
        return field;
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
            var spinner: Spinner = new Spinner(() => {
                return {spin:particle.spin};
            }, (sOut)=> particle.angle+=sOut.dAngle);
            var view = new SpriteAngledView(particle, sheet);
            return new SingleGameObject(particle, [mover, animator, spinner], [view]);
        });
        var remover: ParticleRemover = new ParticleRemover(fieldData, particles);

        var fieldObj = new MultiGameObject(fieldData, [generator, remover], [], particles);
        return fieldObj;
    }
}
