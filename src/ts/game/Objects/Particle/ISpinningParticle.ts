import { IParticle } from "../../../gamelib/Components/ParticleFieldComponent";

export interface ISpinningParticle extends IParticle {
    spin: number;
    angle: number;
}