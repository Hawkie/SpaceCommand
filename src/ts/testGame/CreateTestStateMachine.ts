import { IStateProcessor } from "../gamelib/1Common/StateProcessor";
import { DisplayTitle } from "../game/Components/TitleComponent";
import { KeyStateProvider } from "../gamelib/1Common/KeyStateProvider";

export function CreateTestStateMachine(): IStateProcessor<string> {
    return {
        id: 1,
        name: "test",
        sound: EmptyUpdate,
        display: DisplayTitle,
        input: EmptyInput,
        update: EmptyUpdate,
        next: (state: string) => { return undefined; }
    };
}

export function EmptyInput<T>(state:T, keyStateProvider:KeyStateProvider, timeModifier:number): T {
    return state;
}

export function EmptyUpdate<T>(state: T, timeModifier: number): T {
    return state;
}