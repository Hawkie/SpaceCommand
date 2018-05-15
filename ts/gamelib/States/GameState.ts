import { DrawContext} from "ts/gamelib/Common/DrawContext";
import { Coordinate } from "ts/gamelib/Data/Coordinate";
import { Keys, KeyStateProvider } from "ts/gamelib/Common/KeyStateProvider";


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

    update(timeModifier: number): void {
        //
     }

    display(drawContext: DrawContext): void {
        //
    }

    sound(actx: AudioContext): void {
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