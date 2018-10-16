import { IActor } from "ts/gamelib/Actors/Actor";
import { IPred } from "./ParticleFieldUpdater";
export class ParticleRemover implements IActor {
    constructor(private removeFunction: () => void) { }
    update(timeModifier: number): void {
        this.removeFunction();
    }
    static remove<M, T>(getModelParticles: () => M[], getParticles: () => T[], preds: IPred<M>[]): void {
        var modelParticles: M[] = getModelParticles();
        var particles: T[] = getParticles();
        for (var i: number = modelParticles.length - 1; i >= 0; i--) {
            var element: M = modelParticles[i];
            // var p: IParticleRemoverInputs = getP(element);
            preds.forEach(pred => {
                if (pred.Test(element)) {
                    modelParticles.splice(i, 1);
                    particles.splice(i, 1);
                }
            });
        }
    }
}