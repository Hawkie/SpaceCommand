// import { IActor } from "../../../../src/ts/gamelib/Actors/Actor";
// import { IPred } from "./ParticleFieldUpdater";
// export class ParticleRemover implements IActor {
//     constructor(private removeFunction: () => void) { }
//     update(timeModifier: number): void {
//         this.removeFunction();
//     }
//     static remove<M, T>(getModelParticles: () => M[], getParticles: () => T[], preds: IPred<M>[]): void {
//         let modelParticles: M[] = getModelParticles();
//         let particles: T[] = getParticles();
//         for (let i: number = modelParticles.length - 1; i >= 0; i--) {
//             let element: M = modelParticles[i];
//             // let p: IParticleRemoverInputs = getP(element);
//             preds.forEach(pred => {
//                 if (pred.Test(element)) {
//                     modelParticles.splice(i, 1);
//                     particles.splice(i, 1);
//                 }
//             });
//         }
//     }
// }

// export function remove<M>(modelParticles: M[], pred: (m: M)=> boolean): number[] {
//     let toRemove: number[] = [];
//     for (let i: number = modelParticles.length - 1; i >= 0; i--) {
//         let element: M = modelParticles[i];
//         if (pred(element)) {
//             toRemove.push(i);
//         }
//     }
//     return toRemove;
// }

// export function RemoveParticle(timeModifier: number, particle: IParticle): IField

// // pure functions - create new
// function reducerRemoveParticles(particles: IParticle[], toRemove: number[]): IParticle[] {
//     return particles;
// }