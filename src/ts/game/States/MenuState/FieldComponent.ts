import { CreateParticles, GenerationCheck } from "../../../gamelib/Actors/ParticleGenerator2";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { IParticle } from "../../Objects/Particle/IParticle";
import { IParticleField } from "../Asteroids/createAsteroidData";
import { Move } from "../../../gamelib/Actors/Movers";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { DisplayRectangle } from "../../../gamelib/Views/RectangleView";


// map field data (particles[]) to particle view
export function fieldToView(ctx: DrawContext, particles: IParticle[]): void {
    particles.forEach(p =>  DisplayRectangle(ctx, p.x, p.y, p.size, p.size));
}

export function reduceField(timeModifier: number,
        field: IParticleField,
        func: (now: number) => IParticle): IParticleField {
    let f: IParticleField = field;
    if (field.on) {
        f = GenerationCheck(timeModifier, f, f.particlesPerSecond);
        f = CreateAndAddParticles(timeModifier, f, f.toAdd, func);
    }
    return MoveParticleField(timeModifier, f);
}


// pure function
function MoveParticleField(timeModifier: number, particleField: IParticleField): IParticleField {
    return Object.assign({}, particleField, {
        particles: particleField.particles.map((p)=> Move(timeModifier, p, p.Vx, p.Vy))
    });
}

// add
function CreateAndAddParticles(timeModifier: number,
        starField: IParticleField,
        toAdd: number,
        func: (now: number)=> IParticle): IParticleField {
    return Object.assign({}, starField, {
        particles: starField.particles.concat(
            CreateParticles(timeModifier, toAdd, func))
    });
}

// pure functions - create new
function reducerRemoveParticles(particles: IParticle[], toRemove: number[]): IParticle[] {
    return particles;
}

