import { Vector } from "ts/Physics/Common";
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
//import { IModel } from "ts/Models/DynamicModels"; 
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { VectorAccelerator } from "ts/Actors/Accelerators";
import { SingleGameObject } from "ts/GameObjects/GameObject";

export class ParticleGenerator implements IActor {
    constructor(private data: ParticleFieldData, private field: SingleGameObject<ParticleData>[],
        private createParticle: (now: number) => SingleGameObject<ParticleData>) { }
    
    update(lastTimeModifier: number) {
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
            if (this.data.lifeTimeInSec > 0) {
                var ageInSec = (now - element.model.born) / 1000;
                if (ageInSec > this.data.lifeTimeInSec) {
                    this.field.splice(i, 1);
                    removed = true;
                }
            }
            // TODO remove this bit
            // update if still remains
            //if (!removed) {
            //    element.update(timeModifier);
            //}
        }
    }
}