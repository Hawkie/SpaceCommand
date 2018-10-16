import { Assets } from "ts/gamelib/1Common/Assets";
import { IGameObject } from "../../../gamelib/GameObjects/IGameObject";
import { AsteroidFields } from "ts/game/States/Asteroids/AsteroidFields";
import { createStateModel } from "ts/game/States/Asteroids/AsteroidModels";
import { IAsteroidModel } from "./IAsteroidModel";
import { IAsteroidStateObject, createAsteroidStateObject } from "ts/game/States/Asteroids/AsteroidObjects";
import { AsteroidState } from "./AsteroidState";
export function createState(assets: Assets, actx: AudioContext): AsteroidState {
    var spriteField: IGameObject = AsteroidFields.createSpriteField();
    var state: IAsteroidModel = createStateModel();
    var stateObj: IAsteroidStateObject = createAsteroidStateObject(() => state);
    // get state objects and add asteroid objects
    var asteroidState: AsteroidState = new AsteroidState("Asteroids", assets, actx, state, stateObj, [spriteField]);
    return asteroidState;
}