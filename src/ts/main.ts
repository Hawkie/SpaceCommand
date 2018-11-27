import { CreateMenuState, IMenuState,
    SoundMenuState, DisplayMenuState, InputMenuState, UpdateMenuState } from "./game/States/MenuState/MenuState";
import { CreateGameStateLandExplorer, ILandExplorerGameState,
    Display, Input, Update, Sounds } from "./game/States/LandExplorer/LandExplorerGameState";
import { Game2 } from "./gamelib/1Common/Game2";
import { IStateProcessor } from "./gamelib/1Common/StateProcessor";
import { IState, createStateMachineProcessor } from "./gamelib/1Common/StateMachine";
import { IAsteroidsGameState, CreateAsteroidsGameState,
    SoundsAsteroidsGameState, DisplayAsteroidsGameState,
    InputAsteroidsGameState, UpdateAsteroidsGameState } from "./game/States/Asteroids/AsteroidGameState";

// create state here and pass to game
// createGameState();


export function createState(): IState {

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

// static _assets: AsteroidAssets = new AsteroidAssets();
// static get assets(): AsteroidAssets { return this._assets; }

let fsm: IStateProcessor<IState> = createStateMachineProcessor();

let game: Game2<IState> = new Game2();
game.run(window, document,createState(), fsm);