import { Game } from "./gamelib/1Common/Game";
import { IStateProcessor } from "./gamelib/1Common/StateProcessor";
import { IState, createStateMachineProcessor } from "./gamelib/1Common/StateMachine";
import { CreateState } from "./game/States/CreateStateMachine";
import { CreateTestStateMachine } from "./testGame/CreateTestStateMachine";

// create state here and pass to game
const state: IState = CreateState();
let fsm: IStateProcessor<IState> = createStateMachineProcessor();

// test state with no complex states
const testState: string = "Test Title";
let testfsm: IStateProcessor<string> = CreateTestStateMachine();

// static _assets: AsteroidAssets = new AsteroidAssets();
// static get assets(): AsteroidAssets { return this._assets; }

let game: Game<IState> = new Game();
game.run(window, document, state, fsm);