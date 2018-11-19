import { CreateAndAddParticles, GenerationCheck } from "../../gamelib/Actors/ParticleGenerator";
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

export interface IField<T> {
    readonly particles: T[];
    readonly accumulatedModifier: number;
    readonly toAdd: number;
    readonly on: boolean;
}

export function CreateField<P>(on: boolean): IField<P> {
    return {
        particles: [],
        accumulatedModifier: 0,
        toAdd: 0,
        on: on,
    };
}

// map field data (particles[]) to particle view
export function DisplayField(ctx: DrawContext, particles: IParticle[]): void {
    particles.forEach(p =>  DisplayRectangle(ctx, p.x, p.y, p.size, p.size));
}

export function UpdateField<P extends IParticle, F extends IField<P>>(timeModifier: number,
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
export function UpdateParticles<TParticle extends IParticle, TField extends IField<TParticle>>(
        timeModifier: number,
        particleField: TField): TField {
    return Object.assign({}, particleField, {
        particles: particleField.particles.map((p)=> MoveWithVelocity(timeModifier, p, p.Vx, p.Vy))
    });
}
