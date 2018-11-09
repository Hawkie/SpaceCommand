import { DrawContext} from "src/ts/gamelib/1Common/DrawContext";
import { Keys, KeyStateProvider } from "src/ts/gamelib/1Common/KeyStateProvider";

export interface IGameState {
    name: string;
    update(lastDrawModifier : number): void;
    display(drawingContext: DrawContext): void;
    input(keyStateProvider: KeyStateProvider, lastDrawModifier: number): void;
    tests(lastTestModifier: number): void;
    returnState(): number;
}

// the game state makes use of five methods; Update, display, sound, tests and input.
// these are called with objects and implement the visitor pattern by calling these methods in
// the objects held in the state.
export abstract class GameState implements IGameState {

    constructor(public name: string = "Base State") { }

    update(timeModifier: number): void {
        //
     }

    display(drawContext: DrawContext): void {
        //
    }

    tests(lastTestModifier: number): void {
        //
     }

    input(keyStateProvider: KeyStateProvider, lastDrawModifier: number): void {
        //
     }

    returnState(): number { return undefined; }

}