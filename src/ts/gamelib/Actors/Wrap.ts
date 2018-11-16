import { IActor, Actor } from "./Actor";
import { Actor2 } from "./Actor2";
import { IMoveable } from "./Movers";

export interface IWrap {
    value: number;
    lowLimit:number;
    upLimit: number;
}

export function wrap(g:IWrap): number {
        if (g.value > g.upLimit) { return g.lowLimit; }
        if (g.value < g.lowLimit) { return g.upLimit; }
    }

export function createWrapActor(g:()=>IWrap, f:(newV:number)=>void): IActor {
    let a:IActor = new Actor2(g, wrap, f);
    return a;
}

export function Wrap(value: number, lowLimit:number, upLimit: number): number {
    if (value > upLimit) { return lowLimit; }
    if (value < lowLimit) { return upLimit; }
    return value;
}
