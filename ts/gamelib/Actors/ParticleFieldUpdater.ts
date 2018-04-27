import { Vector } from "ts/gamelib/Data/Vector";
import { IActor } from "ts/gamelib/Actors/Actor";
import { IGameObject, SingleGameObject } from "ts/GameObjects/GameObject";

export interface IParticleGenInputs {
    on: ()=>boolean;
    itemsPerSec: number;
    maxGeneratedPerIteration?: number;
    generationTimeInSec?: number;
}

// could use <T> instead of IGameObject
export class ParticleGenerator implements IActor {
    constructor(private getIn: ()=> IParticleGenInputs,
        private createParticle: (now: number) => void) {}

    // state variables
    private lastCheck: number = 0;
    private firstAdded: number = 0;


    update(lastTimeModifier: number): void {
        var inP: IParticleGenInputs = this.getIn();
        this.generate(lastTimeModifier, inP);
    }

    generate(lastTimeModifier: number, inP: IParticleGenInputs): void {
        var now: number = Date.now();
        var on: boolean = inP.on();
        if (!on) {
            this.lastCheck = now;
            this.firstAdded = 0;
        } else {
            var secSinceLast: number = (now - this.lastCheck) / 1000;

            // don't add if past generation time
            if (inP.generationTimeInSec === undefined
                || this.firstAdded === 0
                || ((now - this.firstAdded) / 1000) < inP.generationTimeInSec) {

                // find the integer number of particles to add. conservatively round down
                let toAdd: number = Math.floor(inP.itemsPerSec * secSinceLast);
                if (inP.maxGeneratedPerIteration !== undefined) {
                    toAdd = Math.min(toAdd, inP.maxGeneratedPerIteration);
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

export class ParticleRemover<T> implements IActor {
    constructor(private removeFunction: ()=> void) {}

    update(timeModifier: number): void {
        this.removeFunction();
    }

    static remove<T>(getParticles: ()=> T[],
        preds: IPred<T>[]): void {
        var particles: T[] = getParticles();
        for (var i: number = particles.length - 1; i >= 0; i--) {
            var element: T = particles[i];
            // var p: IParticleRemoverInputs = getP(element);
            preds.forEach(pred => {
                if (pred.Test(element)) {
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
            var ageInSec: number = (Date.now() - this.getBorn(element)) / 1000;
            if (ageInSec > this.lifeTimeInSec()) {
                return true;
            }
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