import { IActor } from "./Actor";


export class Actor2<Tin, Tout> implements IActor {
    constructor(private fin: () => Tin, private feval: (input: Tin) => Tout, private fout: (o: Tout) => void) {
    }
    update(timeModifier: number): void {
        var t: Tin = this.fin();
        var o: Tout = this.feval(t);
        if (o !== undefined) {
            this.fout(o);
        }
    }
}