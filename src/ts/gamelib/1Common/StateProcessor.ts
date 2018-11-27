import { DrawContext } from "./DrawContext";
import { KeyStateProvider } from "./KeyStateProvider";

export interface IStateProcessor<T> {
    id: number;
    name: string;
    sound(state: T, timeModifier: number): T;
    display(ctx: DrawContext, state:T): void;
    input(state:T, keyStateProvider: KeyStateProvider, timeModifier: number): T;
    update(state:T, timeModifier: number): T;
    next(state: T): number;
}

