import { Assets } from "ts/gamelib/1Common/Assets";
import { IGameState } from "ts/gamelib/GameState/GameState";
import { createGameState } from "../States/Asteroids/AsteroidGameState";
import { createLandExplorerGameState } from "../States/LandExplorer/LandExplorerGameState";
import { createMenuState } from "../States/MenuState/MenuGameState";
// import { LandingState } from "ts/States/Land/LandingState";
// import { SoundDesignerState } from "ts/States/SoundDesigner/SoundDesignerState";
// import { LandExplorerState } from "ts/States/LandExplorer/LandExplorerState";
// import { DuelState } from "ts/States/TwoPlayerDuel/DuelState";

export function createGameStates(assets: Assets, actx: AudioContext): IGameState[] {
    let menuState: IGameState = createMenuState(assets, actx);
    let asteroidState: IGameState = createGameState(assets, actx);
    // let landingState = LandingState.create(assets, actx);
    // let soundDesigner = SoundDesignerState.create();
    let landExplorer: IGameState = createLandExplorerGameState(assets, actx);
    // let duel = DuelState.createState(assets, actx);
    // let states = [menuState, asteroidState, landingState, landExplorer, duel];
    let states: IGameState[] = [menuState, asteroidState, landExplorer];
    return states;
}