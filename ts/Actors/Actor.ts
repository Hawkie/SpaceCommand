// data Updater

export interface IActor {
    update(timeModifier: number): void;
}

export class Actor<T> implements IActor {
    constructor(private getInputs:() => T, private set: (inputs: T, timeModifier: number)=>void) {
    }

    update(timeModifier: number): void {
        var state: T = this.getInputs();
        this.set(state, timeModifier);
    }
}

export class Actor2<Tin, Tout> implements IActor {
    constructor(private fin:() => Tin, private feval:(input:Tin)=>Tout, private fout:(o:Tout)=>void) {
    }

    update(timeModifier: number): void {
        var t: Tin = this.fin();
        var o: Tout = this.feval(t);
        if (o !== undefined) {
            this.fout(o);
        }
    }
}

export function f<TIn, TOut>(x: ()=>TIn, act:(x:TIn) => TOut, y:(y:TOut)=> void): void {
}