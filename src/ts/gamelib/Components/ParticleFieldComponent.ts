import { FieldGenerate } from "../Actors/FieldGenerator";
import { DrawContext } from "../../gamelib/1Common/DrawContext";
import { DisplayRectangle } from "../../gamelib/Views/RectangleView";
import { FieldMoveParticlesWithVelocity, IMovesWithVelocity } from "../Actors/FieldMover";

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
}

export function CreateField<P>(on: boolean): IField<P> {
    return {
        particles: [],
        accumulatedModifier: 0,
        toAdd: 0,
    };
}

// map field data (particles[]) to particle view
export function DisplayField(ctx: DrawContext, particles: IParticle[]): void {
    particles.forEach(p =>  DisplayRectangle(ctx, p.x, p.y, p.size, p.size));
}

export function FieldGenMove<P extends IMovesWithVelocity, F extends IField<P>>(timeModifier: number,
        field: F,
        on: boolean,
        particlesPerSecond: number,
        func: (now: number) => P): F {
    let f: F = field;
    if (on) {
        f = FieldGenerate(timeModifier, f, on, particlesPerSecond, func);
    }
    return FieldMoveParticlesWithVelocity(timeModifier, f);
}






