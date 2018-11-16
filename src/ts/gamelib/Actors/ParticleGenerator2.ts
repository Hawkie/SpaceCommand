import { IActor } from "../../../../src/ts/gamelib/Actors/Actor";
import { IMenuState } from "../../game/States/MenuState/MenuState";
import { IParticle } from "../../game/Objects/Particle/IParticle";
import { IParticleField } from "../../game/States/Asteroids/AsteroidState";
// could use <T> instead of IGameObject

export interface IParticleGenInputs2 {
    on: boolean;
}

// create new particles with a set of generator inputs function, and a generator function passed in
// at intervals specified by perSec. Only allow maxGen particles to be creating in any one call
// once created, call the create particle functions.
export class ParticleGenerator2 implements IActor {
    constructor(private getIn: () => IParticleGenInputs2,
    private perSec: number,
    private maxGen: number,
    private createParticle: (now: number) => void) { }
    // state variables
    private lastCheck: number = 0;
    update(lastTimeModifier: number): void {
        let inP: IParticleGenInputs2 = this.getIn();
        let now: number = Date.now();
        let on: boolean = inP.on;
        // reset if initialising
        if (this.lastCheck === 0) {
            this.lastCheck = now;
        }
        // reset if turned off
        if (!on) {
            this.lastCheck = now;
        } else {
            let secSinceLast: number = (now - this.lastCheck) / 1000;
            // find the integer number of particles to add. conservatively round down
            let toAdd: number = Math.floor(this.perSec * secSinceLast);
            // limit max number of particles
            toAdd = Math.min(toAdd, this.maxGen);
            for (let i: number = 0; i < toAdd; i++) {
                this.createParticle(now);
                // reset if particles created
                this.lastCheck = now;
            }
        }
    }
}

export interface IGenerationState {
    accumulatedModifier: number;
    toAdd: number;
}

export interface IGenerationInputs {
    particlesPerSecond: number;
    on: boolean;
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

// pure function. Read only inputs are on, perSec, maxGen. State that changes is lastCheck.
export function CreateParticles<T>(timeModifier: number,
        toAdd: number,
        createParticle: (now: number)=>T): T[] {
    let now: number = Date.now();
    let generatedParticles: T[] = [];
    for (let i: number = 0; i < toAdd; i++) {
        generatedParticles.push(createParticle(now));
    }
    return generatedParticles;
}

