import { IActor, Actor } from "./Actor";
import { Actor2 } from "./Actor2";

export interface IWrap {
    value: number;
    lowLimit:number;
    upLimit: number;
}

export function Wrap(g:IWrap): number {
        if (g.value > g.upLimit) { return g.lowLimit; }
        if (g.value < g.lowLimit) { return g.upLimit; }
    }

export function createWrapActor(g:()=>IWrap, f:(newV:number)=>void): IActor {
    let a:IActor = new Actor2(g, Wrap, f);
    return a;
}