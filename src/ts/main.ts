import { CreateMenuState, IMenuState, CreateGameStateMenu } from "./game/States/MenuState/MenuState";
import { CreateGameStateLandExplorer, ILandExplorerGameState,
    Display, Input, Update, Sounds } from "./game/States/LandExplorer/LandExplorerGameState";
import { createGameState } from "./game/States/Asteroids/AsteroidGameState";
import { Game2 } from "./gamelib/1Common/Game2";
import { IState } from "./gamelib/1Common/State";
import { IStateProcessor } from "./gamelib/1Common/StateProcessor";

// create state here and pass to game
// createGameState();


export function createState(): IState {
    const s0: IMenuState = CreateMenuState();
    const b0: IStateProcessor<IMenuState> = CreateGameStateMenu();

    const s2: ILandExplorerGameState = CreateGameStateLandExplorer();
    const b2: IStateProcessor<ILandExplorerGameState> = {
        id: 2,
        name: "LandExplorer",
        sound: Sounds,
        display: Display,
        input: Input,
        update: Update,
        next: (state: ILandExplorerGameState) => {
            if (state.landState.controls.exit) {
                return 0;
            }
            return undefined;
        }
    };
    return {
        activeState: 0,
        states: [s0, s2],
        behaviours: [b0, b2],
    };
}

let game: Game2 = new Game2();
game.run(window, document,createState());