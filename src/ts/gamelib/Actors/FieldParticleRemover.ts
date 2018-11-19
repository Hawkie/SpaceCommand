import { IParticle, IField } from "../Components/ParticleFieldComponent";

export interface IBorn {
    born: number;
}

export function FieldRemoveParticle<P extends IBorn, F extends IField<P>>(timeModifier: number, field: F, durationSec: number): F {
    const now: number = Date.now();
    return Object.assign({}, field, {
        particles: FilterParticles(field.particles, now, durationSec)
    });
}

export function FilterParticles<P extends IBorn>(particles: ReadonlyArray<P>, now: number, durationSec: number): P[] {
    return particles.filter(p => { return (now - p.born)/1000 < durationSec;});
}
