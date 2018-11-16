import { IParticle } from "../../Components/FieldComponent";

export interface ISpinningParticle extends IParticle {
    spin: number;
    angle: number;
}