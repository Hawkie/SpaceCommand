import { Vector } from "ts/Physics/Common";
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
//import { IModel } from "ts/Models/DynamicModels"; 
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { Accelerator } from "ts/Actors/Accelerators";
import { IGameObject, SingleGameObject } from "ts/GameObjects/GameObject";

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