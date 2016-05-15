import { Vector } from "ts/Physics/Common";
import { IParticleFieldData, IParticleData, ParticleData, ParticleFieldData } from "ts/Models/ParticleFieldModel";
import { DynamicModel } from "ts/Models/DynamicModels"; 
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { VectorAccelerator } from "ts/Actors/Accelerators";

export class ParticleGenerator implements IActor {
    constructor(private model: IParticleFieldData, private createParticle: (now:number) => DynamicModel<IParticleData>) { }
    
    update(lastTimeModifier: number) {
        /// TODO: use distribution pattern for start instead of absolute x,y (canvas size
        var now = Date.now();
        if (!this.model.on) {
            this.model.lastCheck = now;
            this.model.firstAdded = 0;
        }
        if (this.model.on) {
            var secSinceLast = (now - this.model.lastCheck) / 1000;

            // Don't add if past generation time
            if (this.model.generationTimeInSec == 0 || this.model.firstAdded == 0 || ((now - this.model.firstAdded) / 1000) < this.model.generationTimeInSec) {
                
                // find the integer number of particles to add. conservatively round down
                let toAdd = Math.floor(this.model.itemsPerSec * secSinceLast);
                for (let i: number = 0; i < toAdd; i++) {
                    var particleModel = this.createParticle(now);
                    //this.actors.forEach(a => particleModel.
                    this.model.particles.push(particleModel);
                    if (this.model.firstAdded == 0) this.model.firstAdded = now;
                    this.model.lastCheck = now;
                }
            }
        }
    }
}

export class ParticleFieldMover implements IActor {
    constructor(private model: IParticleFieldData) { }

    update(timeModifier: number) {
        var now = Date.now();
        // move objects
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
            // draw if still remains
            if (!removed) {
                element.update(timeModifier);
            }
        }
    }
}