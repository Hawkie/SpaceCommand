import { IActor, Actor, Actor2 } from "./Actor";

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
    var a:IActor = new Actor2(g, Wrap, f);
    return a;
}