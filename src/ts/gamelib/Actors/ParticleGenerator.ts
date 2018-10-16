import { IActor } from "ts/gamelib/Actors/Actor";
import { IParticleGenInputs } from "./ParticleFieldUpdater";
// could use <T> instead of IGameObject
// the Particle Generator creates particles
export class ParticleGenerator implements IActor {
    constructor(private getIn: () => IParticleGenInputs,
    private createParticle: (now: number) => void,
    private itemsPerSec: number,
    private maxGeneratedPerIteration?: number,
    private generationTimeInSec?: number) { }
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