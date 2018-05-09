import { Vector } from "ts/gamelib/Data/Vector";
import { IActor } from "ts/gamelib/Actors/Actor";
import { IGameObject, SingleGameObject } from "ts/gamelib/GameObjects/GameObject";
import { ElapsedTimeLimit } from "./Timers";

export interface IParticleGenInputs {
    on: boolean;
}

// could use <T> instead of IGameObject
export class ParticleGenerator implements IActor {
    constructor(private getIn: ()=> IParticleGenInputs,
        private createParticle: (now: number) => void,
        private itemsPerSec: number,
        private maxGeneratedPerIteration?: number,
        private generationTimeInSec?: number) {}

    // used to calculated the particles per second
    private lastCheck: number = 0;
    // used for calculating the time particles are generated
    private firstAdded: number = 0;

    update(lastTimeModifier: number): void {
        var inP: IParticleGenInputs = this.getIn();
        var now: number = Date.now();
        var on: boolean = inP.on;
        if (!on) {
            this.lastCheck = now;
            this.firstAdded = 0;
        } else {
            var secSinceLast: number = (now - this.lastCheck) / 1000;

            // don't add if past generation time
            if (this.generationTimeInSec === undefined
                || this.firstAdded === 0
                || ((now - this.firstAdded) / 1000) < this.generationTimeInSec) {

                // find the integer number of particles to add. conservatively round down
                let toAdd: number = Math.floor(this.itemsPerSec * secSinceLast);
                if (this.maxGeneratedPerIteration !== undefined) {
                    toAdd = Math.min(toAdd, this.maxGeneratedPerIteration);
                }
                for (let i: number = 0; i < toAdd; i++) {
                    this.createParticle(now);
                    if (this.firstAdded === 0) {
                        this.firstAdded = now;
                    }
                    this.lastCheck = now;
                }
            }
        }
    }
}

export interface IParticleGenInputs2 {
    on: boolean;
}

// could use <T> instead of IGameObject
export class ParticleGenerator2 implements IActor {
    constructor(private getIn: ()=> IParticleGenInputs2,
        private perSec: number,
        private maxGen: number,
        private createParticle: (now: number) => void) {}

    // state variables
    private lastCheck: number = 0;

    update(lastTimeModifier: number): void {
        var inP: IParticleGenInputs2 = this.getIn();
        var now: number = Date.now();
        var on: boolean = inP.on;
        // reset if initialising
        if (this.lastCheck === 0) {
            this.lastCheck = now;
        }
        // reset if turned off
        if (!on) {
            this.lastCheck = now;
        } else {
            var secSinceLast: number = (now - this.lastCheck) / 1000;
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


export class ParticleRemover implements IActor {
    constructor(private removeFunction: ()=> void) {}

    update(timeModifier: number): void {
        this.removeFunction();
    }

    static remove<M, T>(getModelParticles: () => M[],
        getParticles: ()=> T[],
        preds: IPred<M>[]): void {
        var modelParticles: M[] = getModelParticles();
        var particles: T[] = getParticles();
        for (var i: number = modelParticles.length - 1; i >= 0; i--) {
            var element: M = modelParticles[i];
            // var p: IParticleRemoverInputs = getP(element);
            preds.forEach(pred => {
                if (pred.Test(element)) {
                    modelParticles.splice(i, 1);
                    particles.splice(i, 1);
                }
            });
        }
    }
}

export interface IPred<TElement> {
    Test(element: TElement): boolean;
}

export class AgePred<TElement> implements IPred<TElement> {
    constructor(private lifeTimeInSec: ()=>number,
    private getBorn: (p: TElement)=>number) {}

    Test(element: TElement): boolean {
        if (this.lifeTimeInSec !== undefined) {
            return ElapsedTimeLimit(this.getBorn(element), this.lifeTimeInSec());
            // var ageInSec: number = (Date.now() - this.getBorn(element)) / 1000;
            // if (ageInSec > this.lifeTimeInSec()) {
            //     return true;
            // }
        }
        return false;
    }
}

export class PredGreaterThan<TElement> implements IPred<TElement> {
    constructor(private greaterThan: ()=>number,
        private get: (p: TElement)=>number) {}

    Test(element: TElement): boolean {
        if (this.greaterThan !== undefined) {
            if (this.get(element) > this.greaterThan()) {
                return true;
            }
        }
        return false;
    }
}