import { SparseArray } from "ts/Collections/SparseArray";
import { Canvas } from "ts/Common/Canvas";
import { IGameState } from "ts/States/GameState";


export class KeyStateProvider {
    constructor(private window: Window) {
        this.addKeyEvents();
    }

    private _keysDown: SparseArray<number> = new SparseArray<number>();

    addKeyEvents() {
        const kd = (e: KeyboardEvent) => {
            this._keysDown.add(e.keyCode);
            console.log("Down" + e.type + e.keyCode + e.key);
            console.log(this._keysDown);
        };
        const ku = (e: KeyboardEvent) => {
            this._keysDown.remove(e.keyCode);
            console.log("Up" + e.type + e.keyCode + e.key);
            console.log(this._keysDown);
        };
        this.window.addEventListener("keydown", kd, false);
        this.window.addEventListener("keypress", kd, false);
        this.window.addEventListener("onkeydown", kd, false);
        this.window.addEventListener("keyup", ku, false);
    }

    isKeyDown(key: number): boolean { return this._keysDown.contains(key); }
}

export enum Keys {
    // Some handy key codes
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