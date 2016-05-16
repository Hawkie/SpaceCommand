import { DrawContext} from "../Common/DrawContext";
import { SparseArray } from "../Collections/SparseArray"
import { Coordinate } from "../Physics/Common"
import { Keys, KeyStateProvider } from "../Common/KeyStateProvider";


export interface IGameState
{
    name: string;
    update(lastDrawModifier : number);
    display(drawingContext : DrawContext);
    input(keyStateProvider: KeyStateProvider, lastDrawModifier: number);
    tests(lastTestModifier: number);
    returnState() : IGameState;
}

//export abstract class GameState {
//}