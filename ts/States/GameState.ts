import { DrawContext} from "ts/Common/DrawContext";
import { SparseArray } from "ts/Collections/SparseArray";
import { Coordinate } from "ts/Physics/Common";
import { Keys, KeyStateProvider } from "ts/Common/KeyStateProvider";


export interface IGameState
{
    name: string;
    update(lastDrawModifier : number);
    display(drawingContext: DrawContext);
    sound(audioContext: AudioContext);
    input(keyStateProvider: KeyStateProvider, lastDrawModifier: number);
    tests(lastTestModifier: number);
    returnState() : number;
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