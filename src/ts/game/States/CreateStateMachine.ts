
import { IMenuState, CreateMenuState, SoundMenuState, DisplayMenuState, InputMenuState, UpdateMenuState } from "./MenuState/MenuState";
import { IStateProcessor } from "../../gamelib/1Common/StateProcessor";
import { CreateGameStateLandExplorer, Sounds, Display, Input, Update, ILandExplorerGameState } from "./LandExplorer/LandExplorerGameState";
import { IAsteroidsGameState, CreateAsteroidsGameState,
    SoundsAsteroidsGameState, DisplayAsteroidsGameState,
    InputAsteroidsGameState, UpdateAsteroidsGameState } from "./Asteroids/AsteroidGameState";
import { IState } from "../../gamelib/1Common/StateMachine";


export function CreateState(): IState {

    enum StateId {
        Menu, // 0
        Asteroids, // 1
        LandExplorer,
    }

    const s0: IMenuState = CreateMenuState(["Asteroids", "Land Explorer"]);
    const b0: IStateProcessor<IMenuState> = {
        id: StateId.Menu,
        name: "Main Menu",
        sound: SoundMenuState,
        display: DisplayMenuState,
        input: InputMenuState,
        update: UpdateMenuState,
        next: (state: IMenuState) => {
            if (state.menu.selected) {
                switch (state.menu.itemFocus) {
                    case 0:
                        return StateId.Asteroids;
                    case 1:
                        return StateId.LandExplorer;
                }
            }
            return undefined;
        }
    };

    const s1: IAsteroidsGameState = CreateAsteroidsGameState();
    const b1: IStateProcessor<IAsteroidsGameState> = {
        id: StateId.Asteroids,
        name: "Asteroids",
        sound: SoundsAsteroidsGameState,
        display: DisplayAsteroidsGameState,
        input: InputAsteroidsGameState,
        update: UpdateAsteroidsGameState,
        next: (state: IAsteroidsGameState) => {
            if (state.asteroidsState.controls.exit) {
                return StateId.Menu;
            }
            return undefined;
        }
    };

    const s2: ILandExplorerGameState = CreateGameStateLandExplorer();
    const b2: IStateProcessor<ILandExplorerGameState> = {
        id: StateId.LandExplorer,
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
        states: [s0, s1, s2],
        behaviours: [b0, b1, b2],
    };
}



