import { IActor } from "ts/gamelib/Actors/Actor";
import { IParticleGenInputs2 } from "./ParticleFieldUpdater";
// could use <T> instead of IGameObject

// create new particles with a set of generator inputs function, and a generator function passed in
// at intervals specified by perSec. Only allow maxGen particles to be creating in any one call
// once created, call the create particle functions.
export class ParticleGenerator2 implements IActor {
    constructor(private getIn: () => IParticleGenInputs2,
    private perSec: number,
    private maxGen: number, private createParticle: (now: number) => void) { }
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