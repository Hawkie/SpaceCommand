import { IGameState } from "../../gamelib/GameState/GameState";
import { createGameState } from "../States/Asteroids/AsteroidGameState";
import { createLandExplorerGameState } from "../States/LandExplorer/LandExplorerGameState";
import { createMenuState } from "../States/MenuState/MenuGameState";
import { createMenuState2 } from "../States/MenuState/MenuGameState2";
// import { LandingState } from "ts/States/Land/LandingState";
// import { SoundDesignerState } from "ts/States/SoundDesigner/SoundDesignerState";
// import { LandExplorerState } from "ts/States/LandExplorer/LandExplorerState";
// import { DuelState } from "ts/States/TwoPlayerDuel/DuelState";

export function createGameStates(): IGameState[] {
    let menuState: IGameState = createMenuState2();
    let asteroidState: IGameState = createGameState();
    // let landingState = LandingState.create(assets, actx);
    // let soundDesigner = SoundDesignerState.create();
    let landExplorer: IGameState = createLandExplorerGameState();
    // let duel = DuelState.createState(assets, actx);
    // let states = [menuState, asteroidState, landingState, landExplorer, duel];
    let states: IGameState[] = [menuState, asteroidState, landExplorer];
    return states;
}