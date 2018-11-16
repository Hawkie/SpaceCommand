import { AgePred } from "../../../gamelib/Actors/ParticleFieldUpdater";
import { ParticleRemover } from "../../../gamelib/Actors/ParticleRemover";
import { ParticleGenerator2 } from "../../../gamelib/Actors/ParticleGenerator2";
import { Accelerator, IAcceleratorInputs, IAcceleratorOutputs } from "../../../gamelib/Actors/Accelerator";
import { MultiGameObject } from "../../../gamelib/GameObjects/MultiGameObject";
import { SingleGameObject } from "../../../gamelib/GameObjects/SingleGameObject";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { Vector } from "../../../gamelib/DataTypes/Vector";
import { createParticleObject } from "./createParticleObject";
import { IFieldInputs } from "./IFieldInputs";
import { IParticleField, IParticle } from "../../Components/FieldComponent";

// creates a particle field of game objects
export function createParticleField(particleField: IParticleField, fieldInputs: () => IFieldInputs): MultiGameObject<SingleGameObject> {
    let fieldArray: SingleGameObject[] = [];
    // todo: change class to remove null later
    let field: MultiGameObject<SingleGameObject> = new MultiGameObject<SingleGameObject>([], [], () => fieldArray);
    let generator: ParticleGenerator2 = new ParticleGenerator2(fieldInputs,
        particleField.particlesPerSecond,
        particleField.maxParticlesPerSecond,
        (now: number) => {
            let source: IFieldInputs = fieldInputs();
            let p: IParticle = {
                x: source.x + source.xOffset + Transforms.random(source.xLowSpread, source.xHighSpread),
                y: source.y + source.yOffset + Transforms.random(source.yLowSpread, source.yHighSpread),
                Vx: source.Vx + Transforms.random(source.vXLowSpread, source.vXHighSpread),
                Vy: source.Vy + Transforms.random(source.vYLowSpread, source.vYHighSpread),
                born: now,
                size: particleField.particleSize,
        };
        let newParticle: SingleGameObject = createParticleObject(p);
        if (particleField.gravityStrength !== 0) {
            let getAcceleratorProps: () => IAcceleratorInputs = () => {
                return {
                    x: p.x,
                    y: p.y,
                    Vx: p.Vx,
                    Vy: p.Vy,
                    forces: [new Vector(180, particleField.gravityStrength)],
                    mass: 1,
                };
            };
            let gravity: Accelerator = new Accelerator(getAcceleratorProps, (out: IAcceleratorOutputs) => {
                p.Vx += out.dVx;
                p.Vy += out.dVy;
            });
            newParticle.actors.push(gravity);
        }
        particleField.particles.push(p);
        field.getComponents().push(newParticle);
    });
    let age1: AgePred<IParticle> = new AgePred(() => particleField.particleLifetime, (p: IParticle) => p.born);
    let remover: ParticleRemover = new ParticleRemover(() => {
        ParticleRemover.remove(() => particleField.particles, field.getComponents, [age1]);
    });
    // add the generator to the field object
    field.actors.push(generator, remover);
    return field;
}