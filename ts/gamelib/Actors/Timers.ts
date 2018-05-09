import { IActor } from "./Actor";

export function ElapsedTimeLimit(since: number, limit:number): boolean {
    var now:number = Date.now();
    if ((now-since)/1000 > limit) {
        return true;
    }
    return false;
}

export function ReachedCountLimit(count: number, limit:number): boolean {
    if (count > limit) {
        return true;
    }
    return false;
}

export interface ITimer {
    enabled: boolean;
    limit: number;
}

export class Timer implements IActor {
    constructor(private getf: ()=>ITimer, private outf: ()=>void, private since: number = undefined, private elapsed:boolean = false) { }

    update(timeModifer: number): void {
        var timer: ITimer = this.getf();
        // check souce
        if (timer.enabled) {
            if (!this.elapsed) {
                // self initialise since if set to undefined.
                if (this.since === undefined) {
                    this.since = Date.now();
                }
                if (ElapsedTimeLimit(this.since, timer.limit)) {
                    this.outf();
                    this.elapsed = true;
                }
            }
        }
    }
}
