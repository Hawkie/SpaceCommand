import { ElapsedTimeLimit } from "./Timers";

export interface IParticleGenInputs {
    on: boolean;
}

export interface IParticleGenInputs2 {
    on: boolean;
}

export interface IPred<TElement> {
    Test(element: TElement): boolean;
}

export class AgePred<TElement> implements IPred<TElement> {
    constructor(private lifeTimeInSec: ()=>number,
    private getBorn: (p: TElement)=>number) {}

    Test(element: TElement): boolean {
        if (this.lifeTimeInSec !== undefined) {
            return ElapsedTimeLimit(this.getBorn(element), this.lifeTimeInSec());
            // let ageInSec: number = (Date.now() - this.getBorn(element)) / 1000;
            // if (ageInSec > this.lifeTimeInSec()) {
            //     return true;
            // }
        }
        return false;
    }
}

export class PredGreaterThan<TElement> implements IPred<TElement> {
    constructor(private greaterThan: ()=>number,
        private get: (p: TElement)=>number) {}

    Test(element: TElement): boolean {
        if (this.greaterThan !== undefined) {
            if (this.get(element) > this.greaterThan()) {
                return true;
            }
        }
        return false;
    }
}