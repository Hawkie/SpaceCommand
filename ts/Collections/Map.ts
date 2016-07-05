export class KeyValue<T> {
    constructor(public x:number, public v:T) {}
}

export class Map<T> {
    private keys: number[]; //index -> x 
    private items: { [key: number]: T }; // x -> y

    constructor() {
        this.keys = [];
        this.items = {};
    }

    add(key: number, value: T): void {
        var index = this.keys.indexOf(key);
        this.keys.push(key);
        this.keys.sort();
        this.items[key] = value;
    }

    remove(key: number) {

    }

    has(key: number): boolean {
        return key in this.items;
    }

    get(key: number): T {
        return this.items[key];
    }

    //range(xstart: number, xend: number) {
    //    let index = 0;
    //    let found = false;
    //    let finished = false;
    //    let results: KeyValue<T>[] = [];
    //    while (!found && !finished) {
    //        let x = this.keys[index];
    //        if (x >= xstart && x <= xend) {
    //            let y = this.
    //            results.push(new KeyValue<T>(k1, this.items[k1]));
    //        }
    //        index++;
    //    }
    //}
}

//import { Coordinate } from "ts/Physics/Common";

//let m: [number, number, [Coordinate]];
//m[2, 10] = [new Coordinate(2,10)];
//for (let x = 0; x < 100; x++) {
//    for (let y = 0; y < 100; y++) {
//        m[x, y];
//    }
//}
