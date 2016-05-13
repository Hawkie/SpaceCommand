import { SparseArray } from "ts/Collections/SparseArray";
import { Canvas } from "ts/Common/Canvas";
import { IGameState } from "ts/States/GameState";


export class KeyStateProvider {
    constructor(private window: Window) {
        this.addKeyEvents();
    }

    private _keysDown: SparseArray<number> = new SparseArray<number>(10);

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
    LeftArrow = 37,
    UpArrow = 38,
    RightArrow = 39,
    DownArrow = 40,
    SpaceBar = 32,
    Tab = 9,
    Enter = 13,
    End = 35,
    Home = 36,
    PageUp = 33,
    PageDown = 34
}