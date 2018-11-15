import { CreateParticles, GenerationCheck } from "../../../gamelib/Actors/ParticleGenerator2";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { IParticle } from "../../Objects/Particle/IParticle";
import { IParticleField } from "../Asteroids/createAsteroidData";
import { MoveWithVelocity, IMoveable } from "../../../gamelib/Actors/Movers";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { DisplayRectangle } from "../../../gamelib/Views/RectangleView";

export interface IPField<T> {
    particles: T[];
}

export interface IMovesWithVelocity extends IMoveable {
    Vx: number;
    Vy: number;
}

// map field data (particles[]) to particle view
export function fieldToView(ctx: DrawContext, particles: IParticle[]): void {
    particles.forEach(p =>  DisplayRectangle(ctx, p.x, p.y, p.size, p.size));
}

export function reduceField(timeModifier: number,
        field: IParticleField,
        particlesPerSecond: number,
        func: (now: number) => IParticle): IParticleField {
    let f: IParticleField = field;
    if (field.on) {
        f = GenerationCheck(timeModifier, f, particlesPerSecond);
        f = CreateAndAddParticles(timeModifier, f, f.toAdd, func);
    }
    return MoveParticleField(timeModifier, f);
}


// pure function
function MoveParticleField<P extends IMovesWithVelocity, T extends IPField<P>>(timeModifier: number, particleField: T): T {
    return Object.assign({}, particleField, {
        particles: particleField.particles.map((p)=> MoveWithVelocity(timeModifier, p, p.Vx, p.Vy))
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

