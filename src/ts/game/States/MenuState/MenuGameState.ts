import { DrawContext} from "../../../gamelib/1Common/DrawContext";
import { IGameState } from "../../../gamelib/GameState/GameState";
import { KeyStateProvider } from "../../../gamelib/1Common/KeyStateProvider";
import { createMenuData, IMenuState } from "./createMenuData";
import { IAudioObject, AudioObject } from "../../../gamelib/Sound/AudioObject";
import { fieldToView, reduceField } from "../../Components/FieldComponent";
import { reduceMenu, menuToView, menuToSound } from "./MenuComponent";
import { titleToView } from "../../Components/TitleComponent";
import { reduceKeys, IMenuControl } from "./KeysComponent";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { Game } from "../../Game/Game";
import { stateToSound } from "../Asteroids/AsteroidGameState";


// when creating a game state - create the data and then bind to the objects
export function createMenuState(): MenuState {

    return new MenuState("Menu", createMenuData());
}

// map whole state to view/ctx functions
export function stateToView(ctx: DrawContext, state: IMenuState): void {
    ctx.clear();
    fieldToView(ctx, state.starField1.particles);
    fieldToView(ctx, state.starField2.particles);
    titleToView(ctx, state.title);
    menuToView(ctx, 200, 100, state.menu);
}

export interface IStateAction {
    type: string;
    keys: number[];
}

// pure function
export function reduceState(timeModifier: number, state: IMenuState, action: IStateAction): IMenuState {
    switch (action.type) {
        case "UPDATE": {
            return Object.assign({}, state, {
                starField1: reduceField(timeModifier, state.starField1, true, 2, (now: number) => {
                    return {
                        x: Transforms.random(0, 512),
                        y: 0,
                        Vx: 0,
                        Vy: Transforms.random(10, 30),
                        born: now,
                        size: 1,
                    };
                }),
                starField2: reduceField(timeModifier, state.starField2, true, 3, (now: number) => {
                    return {
                        x: Transforms.random(0, 512),
                        y: 0,
                        Vx: 0,
                        Vy: Transforms.random(30, 50),
                        born: now,
                        size: 2,
                    };
                })
            });
        }
        case "INPUT": {
            let controls: IMenuControl = reduceKeys(timeModifier, action.keys);
            return Object.assign({}, state, {
                control: controls,
                menu: reduceMenu(timeModifier, state.menu, controls)
            });
        }
        case "SOUND": {
            return Object.assign({}, state, {
                menu: menuToSound(state.menu)
            });
        }
        default: return Object.assign({}, state);
    }
}


export class MenuState implements IGameState {

    constructor(public name: string,
        private menuState: IMenuState) {
    }

    update(timeModifier: number): void {
        const menuState: IMenuState = this.menuState;
        // change state!!
        this.menuState = reduceState(timeModifier, menuState, {type:"UPDATE", keys: null});
    }

    display(ctx: DrawContext): void {
        stateToView(ctx, this.menuState);
    }

    sound(timeModifier: number): void {
        const menuState: IMenuState = this.menuState;
        this.menuState = reduceState(timeModifier, menuState, {type:"SOUND", keys: null});
    }

    input(keys: KeyStateProvider, timeModifier: number): void {
        const menuData: IMenuState = this.menuState;
        // change state!!
        this.menuState = reduceState(timeModifier, menuData, {type:"INPUT", keys: keys.getKeys()});
    }

    tests(lastTestModifier: number): void {
        //
    }

    returnState(): number {
        let newState:number = undefined;
        const menuData: IMenuState = this.menuState;
        if (menuData.menu.selected) {
            // states are 0 to n. (Menu state = 0). focus = 0 to n-1
            // need to offset with +1 to get states 1 to n.
            newState = menuData.menu.itemFocus + 1;
        }
        return newState;
    }
}
