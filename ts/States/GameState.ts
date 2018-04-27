import { DrawContext} from "ts/Common/DrawContext";
import { SparseArray } from "ts/Collections/SparseArray";
import { Coordinate } from "ts/Data/Coordinate";
import { Keys, KeyStateProvider } from "ts/Common/KeyStateProvider";


export interface IGameState {
    name: string;
    update(lastDrawModifier : number): void;
    display(drawingContext: DrawContext): void;
    sound(audioContext: AudioContext): void;
    input(keyStateProvider: KeyStateProvider, lastDrawModifier: number): void;
    tests(lastTestModifier: number): void;
    returnState(): number;
}



export abstract class GameState implements IGameState {

    constructor(public name: string = "Base State") { }

    update(timeModifier: number) { }

    display(drawContext: DrawContext) { }

    sound(actx: AudioContext) { }

    tests(lastTestModifier: number) { }

    input(keyStateProvider: KeyStateProvider, lastDrawModifier: number) { }

    returnState(): number { return undefined; }

}