import { Vector } from "ts/Physics/Common";
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { IGameObject, SingleGameObject } from "ts/GameObjects/GameObject";

export interface IParticleGenInputs {
    on: boolean;
    itemsPerSec: number;
    lifeTimeInSec: number;
    maxGeneratedPerIteration?: number;
    generationTimeInSec?: number;
}

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

export interface IParticleRemoverInputs {
    lifeTimeInSec: number;
    particles: number;
    maxParticles: number;
}

export class ParticleRemover2 implements IActor {
    constructor(
        private getInputs: ()=> IParticleRemoverInputs,
        private setOut: (newParticles:IGameObject[])=>void) {}

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