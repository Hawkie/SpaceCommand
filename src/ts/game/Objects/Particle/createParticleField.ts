import { AgePred } from "ts/gamelib/Actors/ParticleFieldUpdater";
import { ParticleRemover } from "ts/gamelib/Actors/ParticleRemover";
import { ParticleGenerator2 } from "ts/gamelib/Actors/ParticleGenerator2";
import { Accelerator, IAcceleratorInputs, IAcceleratorOutputs } from "ts/gamelib/Actors/Accelerator";
import { MultiGameObject } from "ts/gamelib/GameObjects/MultiGameObject";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
import { Transforms } from "ts/gamelib/Physics/Transforms";
import { IParticleField } from "ts/game/States/Asteroids/AsteroidModels";
import { Vector } from "ts/gamelib/Data/Vector";
import { createParticleObject } from "./createParticleObject";
import { IFieldInputs } from "./IFieldInputs";
import { IParticle } from "./IParticle";

// creates a particle field of game objects
export function createParticleField(particleField: IParticleField, fieldInputs: () => IFieldInputs): MultiGameObject<SingleGameObject> {
    var fieldArray: SingleGameObject[] = [];
    // todo: change class to remove null later
    var field: MultiGameObject<SingleGameObject> = new MultiGameObject<SingleGameObject>([], [], () => fieldArray);
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
    var age1: AgePred<IParticle> = new AgePred(() => particleField.particleLifetime, (p: IParticle) => p.born);
    var remover: ParticleRemover = new ParticleRemover(() => {
        ParticleRemover.remove(() => particleField.particles, field.getComponents, [age1]);
    });
    // add the generator to the field object
    field.actors.push(generator, remover);
    return field;
}