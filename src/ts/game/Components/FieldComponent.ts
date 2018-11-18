import { CreateParticles, GenerationCheck, IGenerationState } from "../../gamelib/Actors/ParticleGenerator2";
import { MoveWithVelocity, IMoveable } from "../../gamelib/Actors/Movers";
import { DrawContext } from "../../gamelib/1Common/DrawContext";
import { DisplayRectangle } from "../../gamelib/Views/RectangleView";

export interface IParticle {
    readonly x: number;
    readonly y: number;
    readonly Vx: number;
    readonly Vy: number;
    readonly born: number;
    readonly size: number;
}

export interface IParticleField {
    particles: IParticle[];
    accumulatedModifier: number;
    particlesPerSecond: number;
    maxParticlesPerSecond: number;
    toAdd: number;
    particleLifetime: number;
    particleSize: number;
    on: boolean;
    gravityStrength: number;
}

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

export function CreateField(on: boolean,
    particlesPerSecond: number, // this will go (you spec all this in the update)
    maxParticlesPerSecond: number, // this will go (you spec all this in the update)
    particleSize: number = 2, // this will go (you spec all this in the update)
    particleLifetime: number = undefined, // this will go (you spec all this in the update)
    gravityStrength: number = 0): IParticleField {
    return {
        particles: [],
        accumulatedModifier: 0,
        toAdd: 0,
        particlesPerSecond: particlesPerSecond, // this will go (you spec all this in the update)
        maxParticlesPerSecond: maxParticlesPerSecond, // this will go (you spec all this in the update)
        particleLifetime: particleLifetime, // this will go (you spec all this in the update)
        particleSize: particleSize, // this will go (you spec all this in the update)
        on: true,
        gravityStrength: gravityStrength, // this will go (you spec all this in the update)
    };
}

// map field data (particles[]) to particle view
export function DisplayField(ctx: DrawContext, particles: IParticle[]): void {
    particles.forEach(p =>  DisplayRectangle(ctx, p.x, p.y, p.size, p.size));
}

export function UpdateField<P extends IMovesWithVelocity, F extends IGenerationField<P>>(timeModifier: number,
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

