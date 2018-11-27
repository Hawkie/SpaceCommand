import { CreateMenuState, IMenuState,
    SoundMenuState, DisplayMenuState, InputMenuState, UpdateMenuState } from "./game/States/MenuState/MenuState";
import { CreateGameStateLandExplorer, ILandExplorerGameState,
    Display, Input, Update, Sounds } from "./game/States/LandExplorer/LandExplorerGameState";
import { createGameState } from "./game/States/Asteroids/AsteroidGameState";
import { Game2 } from "./gamelib/1Common/Game2";
import { IState } from "./gamelib/1Common/State";
import { IStateProcessor, createStateMachineProcessor } from "./gamelib/1Common/StateProcessor";

// create state here and pass to game
// createGameState();


export function createState(): IState {

    enum StateId {
        Menu,
//       asteroids,
        LandExplorer,
    }

    const s0: IMenuState = CreateMenuState(["Asteroids", "Land Explorer"]);
    const b0: IStateProcessor<IMenuState> = {
        id: 0,
        name: "Main Menu",
        sound: SoundMenuState,
        display: DisplayMenuState,
        input: InputMenuState,
        update: UpdateMenuState,
        next: (state: IMenuState) => {
            if (state.menu.selected) {
                if (state.menu.itemFocus === 1) {
                    return StateId.LandExplorer;
                }
            }
            return undefined;
        }
    };

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
                return StateId.Menu;
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

let fsm: IStateProcessor<IState> = createStateMachineProcessor();

let game: Game2<IState> = new Game2();
game.run(window, document,createState(), fsm);