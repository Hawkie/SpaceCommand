import { Vector } from "ts/Physics/Common";
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { IParticleFieldData, ParticleFieldData } from "ts/Data/ParticleFieldData";
import { IModel } from "ts/Models/DynamicModels"; 
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { VectorAccelerator } from "ts/Actors/Accelerators";

export class ParticleGenerator implements IActor {
    constructor(private data: IParticleFieldData, private createParticle: (now:number) => IModel<IParticleData>) { }
    
    update(lastTimeModifier: number) {
        /// TODO: use distribution pattern for start instead of absolute x,y (canvas size
        var now = Date.now();
        if (!this.data.on) {
            this.data.lastCheck = now;
            this.data.firstAdded = 0;
        }
        if (this.data.on) {
            var secSinceLast = (now - this.data.lastCheck) / 1000;

            // Don't add if past generation time
            if (this.data.generationTimeInSec == 0 || this.data.firstAdded == 0 || ((now - this.data.firstAdded) / 1000) < this.data.generationTimeInSec) {
                
                // find the integer number of particles to add. conservatively round down
                let toAdd = Math.floor(this.data.itemsPerSec * secSinceLast);
                for (let i: number = 0; i < toAdd; i++) {
                    var particleModel = this.createParticle(now);
                    //this.actors.forEach(a => particleModel.
                    this.data.particles.push(particleModel);
                    if (this.data.firstAdded == 0) this.data.firstAdded = now;
                    this.data.lastCheck = now;
                }
            }
        }
    }
}

export class ParticleModelUpdater implements IActor {
    constructor(private model: IParticleFieldData) { }

    update(timeModifier: number) {
        var now = Date.now();
        // loop through objects
        for (var i: number = this.model.particles.length - 1; i >= 0; i--) {
            var element = this.model.particles[i];
        
            // remove if too old
            let removed = false;
            if (this.model.lifeTimeInSec > 0) {
                var ageInSec = (now - element.data.born) / 1000;
                if (ageInSec > this.model.lifeTimeInSec) {
                    this.model.particles.splice(i, 1);
                    removed = true;
                }
            }
            // update if still remains
            if (!removed) {
                element.update(timeModifier);
            }
        }
    }
}