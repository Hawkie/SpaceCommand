
import { SparseArray } from "ts/gamelib/Collections/SparseArray";


export class KeyStateProvider {
    constructor(private document: Document) {
        this.addKeyEvents();
    }

    private _keysDown: SparseArray<number> = new SparseArray<number>();

    addKeyEvents(): void {
        const kd:any = (e: KeyboardEvent) => {
            this._keysDown.add(e.keyCode);
            console.log("Down" + e.type + e.keyCode + e.key + e.code);
            console.log(this._keysDown);
        };
        const ku:any = (e: KeyboardEvent) => {
            this._keysDown.remove(e.keyCode);
            console.log("Up" + e.type + e.keyCode + e.key + e.code);
            console.log(this._keysDown);
        };
        this.document.addEventListener("keyup", ku, false);
        this.document.addEventListener("keydown", kd, false);
        // this.window.addEventListener("keypress", kd, false);
        // this.window.addEventListener("onkeydown", kd, false);
    }

    isKeyDown(key: number): boolean { return this._keysDown.contains(key); }
}

export enum Keys {
    // some handy key codes
    Tab = 9,
    Enter = 13,
    Shift = 16,
    Esc = 27, // exit state

    SpaceBar = 32,
    PageUp = 33,
    PageDown = 34,
    End = 35,
    Home = 36,

    LeftArrow = 37,
    UpArrow = 38,
    RightArrow = 39,
    DownArrow = 40,

    Num0 = 48,
    Num1 = 49,
    Num2 = 50,

    A = 65,
    D = 68,
    E = 69,
    Q = 81,
    R = 82,
    S = 83,
    W = 87,
    X = 88, // zoom out
    Z = 90, // zoom in
}