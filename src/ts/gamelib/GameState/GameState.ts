import { DrawContext} from "../../../../src/ts/gamelib/1Common/DrawContext";
import { Keys, KeyStateProvider } from "../../../../src/ts/gamelib/1Common/KeyStateProvider";
import { Display } from "../../game/States/LandExplorer/LandExplorerGameState";
import { DisplayTitle } from "../../game/Components/TitleComponent";
import { IMenuState, CreateMenuState } from "../../game/States/MenuState/MenuState";
import { DisplayMenu } from "../../game/Components/MenuComponent";



export interface IGameState {
    name: string;
    update(timeModifier : number): void;
    sound(timeModifier: number): void;
    display(ctx: DrawContext): void;
    input(keyStateProvider: KeyStateProvider, timeModifier: number): void;
    tests(timeModifier: number): void;
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

    sound(timeModifier: number): void {
         //
     }

    display(drawContext: DrawContext): void {
        //
    }

    tests(timeModifier: number): void {
        //
     }

    input(keyStateProvider: KeyStateProvider, timeModifier: number): void {
        //
     }

    returnState(): number { return undefined; }

}