import { Vector } from "ts/Physics/Common";
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { IGameObject, SingleGameObject } from "ts/GameObjects/GameObject";

export interface IParticleGenInputs {
    on: boolean;
    itemsPerSec: number;
    maxGeneratedPerIteration?: number;
    generationTimeInSec?: number;
}

// could use <T> instead of IGameObject
export class ParticleGenerator2 implements IActor {
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
        if (!inP.on) {
            this.lastCheck = now;
            this.firstAdded = 0;
        }
        if (inP.on) {
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


// export interface IParticleRemoverInputs {
//     born: number;
//     x: number;
//     y: number;
// }

export class ParticleRemover2<T> implements IActor {
    constructor(private removeFunction: ()=> void) {}

    update(timeModifier: number): void {
        this.removeFunction();
    }

    static remove<T>(getParticles: ()=> T[],
        // getP: (t: T) => IParticleRemoverInputs,
        preds: IPred<T>[]): void {
        // loop through objects in reverse order so we can delete
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

export class ParticleGenerator implements IActor {
    constructor(private data: ParticleFieldData, private field: IGameObject[],
        private createParticle: (now: number) => IGameObject) { }

    update(lastTimeModifier: number) {
        var now = Date.now();
        if (!this.data.on) {
            this.data.lastCheck = now;
            this.data.firstAdded = 0;
        }
        if (this.data.on) {
            var secSinceLast = (now - this.data.lastCheck) / 1000;

            // Don't add if past generation time
            if (this.data.generationTimeInSec === undefined || this.data.firstAdded == 0 || ((now - this.data.firstAdded) / 1000) < this.data.generationTimeInSec) {
                
                // find the integer number of particles to add. conservatively round down
                let toAdd = Math.floor(this.data.itemsPerSec * secSinceLast);
                if (this.data.maxGeneratedPerIteration != undefined)
                    toAdd = Math.min(toAdd, this.data.maxGeneratedPerIteration);
                for (let i: number = 0; i < toAdd; i++) {
                    var particleModel = this.createParticle(now);
                    this.field.push(particleModel);
                    if (this.data.firstAdded == 0) this.data.firstAdded = now;
                    this.data.lastCheck = now;
                }
            }
        }
    }
}

export class ParticleRemover implements IActor {
    constructor(private data: ParticleFieldData, private field: SingleGameObject<ParticleData>[]) { }

    update(timeModifier: number) {
        var now = Date.now();
        // loop through objects
        for (var i: number = this.field.length - 1; i >= 0; i--) {
            var element = this.field[i];
        
            // remove if too old
            let removed = false;
            if (this.data.lifeTimeInSec != undefined) {
                var ageInSec = (now - element.model.born) / 1000;
                if (ageInSec > this.data.lifeTimeInSec) {
                    this.field.splice(i, 1);
                    removed = true;
                }
            }
        }
    }
}