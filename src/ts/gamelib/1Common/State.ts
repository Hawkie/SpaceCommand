import { IStateProcessor } from "./StateProcessor";
import { DrawContext } from "./DrawContext";
import { KeyStateProvider } from "./KeyStateProvider";


export interface IState {
    activeState: number;
    states: ReadonlyArray<any>;
    behaviours: ReadonlyArray<any>;
}