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
    var menuState: IGameState = createMenuState(assets, actx);
    var asteroidState: IGameState = createGameState(assets, actx);
    // var landingState = LandingState.create(assets, actx);
    // var soundDesigner = SoundDesignerState.create();
    var landExplorer: IGameState = createLandExplorerGameState(assets, actx);
    // var duel = DuelState.createState(assets, actx);
    // var states = [menuState, asteroidState, landingState, landExplorer, duel];
    var states: IGameState[] = [menuState, asteroidState, landExplorer];
    return states;
}