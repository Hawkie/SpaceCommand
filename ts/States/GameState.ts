import { DrawContext} from "ts/Common/DrawContext";
import { SoundContext } from "ts/Sound/SoundContext";
import { SparseArray } from "ts/Collections/SparseArray"
import { Coordinate } from "ts/Physics/Common"
import { Keys, KeyStateProvider } from "ts/Common/KeyStateProvider";


export interface IGameState
{
    name: string;
    update(lastDrawModifier : number);
    display(drawingContext: DrawContext);
    sound(soundContext: SoundContext);
    input(keyStateProvider: KeyStateProvider, lastDrawModifier: number);
    tests(lastTestModifier: number);
    returnState() : IGameState;
}


export abstract class GameState implements IGameState {

    constructor(public name: string = "Base State") { }

    update(timeModifier: number) { }

    display(drawContext: DrawContext) { }

    sound(sctx: SoundContext) { }

    tests() { }

    input(keyStateProvider: KeyStateProvider, lastDrawModifier: number) { }

    returnState(): IGameState { return null; }

}