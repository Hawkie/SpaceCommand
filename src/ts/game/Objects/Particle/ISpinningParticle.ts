import { IParticle } from "./IParticle";
export interface ISpinningParticle extends IParticle {
    spin: number;
    angle: number;
}