import { IParticleFieldModel, ParticleModel, ParticleFieldModel } from "ts/Models/ParticleFieldModel";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";

export class ParticleFieldUpdater implements IActor {

    constructor(private model: IParticleFieldModel, private startx: () => number, private starty: () => number, private velx: () => number, private vely: () => number) { }
    

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
                    var particleModel = new ParticleModel(this.startx(), this.starty(), this.velx(), this.vely(), now);
                    this.model.points.push(particleModel);
                    if (this.model.firstAdded == 0) this.model.firstAdded = now;
                    this.model.lastCheck = now;
                }
            }
        }

        // move objects
        for (var i: number = this.model.points.length - 1; i >= 0; i--) {
            var element = this.model.points[i];
        
            // remove if too old
            let removed = false;
            if (this.model.lifeTimeInSec > 0) {
                var ageInSec = (now - element.born) / 1000;
                if (ageInSec > this.model.lifeTimeInSec) {
                    this.model.points.splice(i, 1);
                    removed = true;
                }
            }
            // draw if still remains
            if (!removed) {
                var mover = new Mover(element);
                mover.update(lastTimeModifier);
            }
        }
    }
}


export class ParticleFieldMover implements IActor {
    constructor(private model: IParticleFieldModel) { }

    update(timeModifier: number) {
        var now = Date.now();
        // move objects
        for (var i: number = this.model.points.length - 1; i >= 0; i--) {
            var element = this.model.points[i];
        
            // remove if too old
            let removed = false;
            if (this.model.lifeTimeInSec > 0) {
                var ageInSec = (now - element.born) / 1000;
                if (ageInSec > this.model.lifeTimeInSec) {
                    this.model.points.splice(i, 1);
                    removed = true;
                }
            }
            // draw if still remains
            if (!removed) {
                var mover = new Mover(element);
                mover.update(timeModifier);
            }
        }
    }
}