import { IActor } from "./Actor";


export class Actor2<Tin, Tout> implements IActor {
    constructor(private fin: () => Tin, private feval: (input: Tin) => Tout, private fout: (o: Tout) => void) {
    }
    update(timeModifier: number): void {
        let t: Tin = this.fin();
        let o: Tout = this.feval(t);
        if (o !== undefined) {
            this.fout(o);
        }
    }
}