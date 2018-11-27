import { IGameState } from "../../gamelib/GameState/GameState";
// import { createGameState, IAsteroidsGameState } from "./Asteroids/AsteroidGameState";
// import { createLandExplorerGameState, ILandExplorerGameState, CreateGameStateLandExplorer,
// display, Input, Update, Sounds } from "./LandExplorer/LandExplorerGameState";
import { IMenuState, CreateMenuState } from "./MenuState/MenuState";
import { DrawContext } from "../../gamelib/1Common/DrawContext";
import { KeyStateProvider } from "../../gamelib/1Common/KeyStateProvider";
import { DisplayTitle } from "../Components/TitleComponent";
import { IStateProcessor } from "../../gamelib/1Common/StateProcessor";
// import { LandingState } from "ts/States/Land/LandingState";
// import { SoundDesignerState } from "ts/States/SoundDesigner/SoundDesignerState";
// import { LandExplorerState } from "ts/States/LandExplorer/LandExplorerState";
// import { DuelState } from "ts/States/TwoPlayerDuel/DuelState";

// export function createGameStates(): IGameState[] {
//     // let menuState: IGameState = createGameStateMenu();
//     let asteroidState: IGameState = createGameState();
//     // let landingState = LandingState.create(assets, actx);
//     // let soundDesigner = SoundDesignerState.create();
//     let landExplorer: IGameState = createLandExplorerGameState();
//     // let duel = DuelState.createState(assets, actx);
//     // let states = [menuState, asteroidState, landingState, landExplorer, duel];
//     let states: IGameState[] = [menuState, asteroidState, landExplorer];
//     return states;
// }

// example dummy state
let t:IStateProcessor<string> = {
    id: 1,
    name: "test",
    sound: EmptyUpdate,
    display: DisplayTitle,
    input: EmptyInput,
    update: EmptyUpdate,
    next: (state: string) => { return undefined; }
};

export function EmptyInput<T>(state:T, keyStateProvider:KeyStateProvider, timeModifier:number): T {
    return state;
}

export function EmptyUpdate<T>(state: T, timeModifier: number): T {
    return state;
}



