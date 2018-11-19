import { IField } from "../Components/ParticleFieldComponent";
import { MoveWithVelocity, IMoveable } from "./Movers";

export interface IMovesWithVelocity extends IMoveable {
    Vx: number;
    Vy: number;
}

// pure function
export function FieldMoveParticlesWithVelocity<TParticle extends IMovesWithVelocity, TField extends IField<TParticle>>(
        timeModifier: number,
        particleField: TField): TField {
    return Object.assign({}, particleField, {
        particles: particleField.particles.map((p)=> MoveWithVelocity(timeModifier, p, p.Vx, p.Vy))
    });
}