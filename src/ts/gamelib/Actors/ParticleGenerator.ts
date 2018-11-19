import { IMoveable } from "./Movers";
import { IField } from "../Components/ParticleFieldComponent";

// could use <T> instead of IGameObject

export interface IGenerationState {
    accumulatedModifier: number;
    toAdd: number;
}

export function GenerationCheck<TState extends IGenerationState>(timeModifier: number,
        inputState: TState,
        particlesPerSecond: number): TState {
    let accumulatedTime: number = inputState.accumulatedModifier + timeModifier;
    let a: number = particlesPerSecond * accumulatedTime;
    let toAdd: number = Math.floor(a);
    if (particlesPerSecond !== 0) {
        // reset - but could make this better.
        let remainder: number = (a - toAdd)/particlesPerSecond;
        accumulatedTime = remainder;
    }
    return Object.assign({}, inputState, {
        accumulatedModifier: accumulatedTime,
        toAdd: toAdd,
    });
}

// add
export function CreateAndAddParticles<P, F extends IField<P>>(timeModifier: number,
        starField: F,
        toAdd: number,
        func: (now: number)=> P): F {
    return Object.assign({}, starField, {
        particles: starField.particles.concat(
            CreateParticles(timeModifier, toAdd, func))
    });
}

// pure function. Read only inputs are on, perSec, maxGen. State that changes is lastCheck.
export function CreateParticles<P>(timeModifier: number,
        toAdd: number,
        createParticle: (now: number)=>P): P[] {
    let now: number = Date.now();
    let generatedParticles: P[] = [];
    for (let i: number = 0; i < toAdd; i++) {
        generatedParticles.push(createParticle(now));
    }
    return generatedParticles;
}

