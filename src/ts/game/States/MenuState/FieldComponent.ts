import { CreateParticles, GenerationCheck, IGenerationState } from "../../../gamelib/Actors/ParticleGenerator2";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { IParticle } from "../../Objects/Particle/IParticle";
import { IParticleField } from "../Asteroids/createAsteroidData";
import { MoveWithVelocity, IMoveable } from "../../../gamelib/Actors/Movers";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { DisplayRectangle } from "../../../gamelib/Views/RectangleView";

export interface IField<T> {
    particles: T[];
}

export interface IGenerationField<T> extends IGenerationState {
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

export function reduceField<P extends IMovesWithVelocity, F extends IGenerationField<P>>(timeModifier: number,
        field: F,
        on: boolean,
        particlesPerSecond: number,
        func: (now: number) => P): F {
    let f: F = field;
    if (on) {
        f = GenerationCheck(timeModifier, f, particlesPerSecond);
        f = CreateAndAddParticles(timeModifier, f, f.toAdd, func);
    }
    return UpdateParticles(timeModifier, f);
}


// pure function
function UpdateParticles<TParticle extends IMovesWithVelocity, TField extends IField<TParticle>>(
        timeModifier: number,
        particleField: TField): TField {
    return Object.assign({}, particleField, {
        particles: particleField.particles.map((p)=> MoveWithVelocity(timeModifier, p, p.Vx, p.Vy))
    });
}

// add
function CreateAndAddParticles<P extends IMovesWithVelocity, F extends IField<P>>(timeModifier: number,
        starField: F,
        toAdd: number,
        func: (now: number)=> P): F {
    return Object.assign({}, starField, {
        particles: starField.particles.concat(
            CreateParticles(timeModifier, toAdd, func))
    });
}

// pure functions - create new
function reducerRemoveParticles(particles: IParticle[], toRemove: number[]): IParticle[] {
    return particles;
}

