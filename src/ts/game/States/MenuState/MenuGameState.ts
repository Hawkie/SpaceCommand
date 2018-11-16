import { DrawContext} from "../../../gamelib/1Common/DrawContext";
import { IGameState } from "../../../gamelib/GameState/GameState";
import { KeyStateProvider } from "../../../gamelib/1Common/KeyStateProvider";
import { CreateMenuState, IMenuState, UpdateMenuState, DisplayMenuState } from "./MenuState";


// when creating a game state - create the data and then bind to the objects
export function createGameStateMenu(): GameStateMenu {

    return new GameStateMenu("Menu", CreateMenuState());
}


export class GameStateMenu implements IGameState {

    constructor(public name: string,
        private menuState: IMenuState) {
    }

    update(timeModifier: number): void {
        const menuState: IMenuState = this.menuState;
        // change state!!
        this.menuState = UpdateMenuState(timeModifier, menuState, {type:"UPDATE", keys: null});
    }

    display(ctx: DrawContext): void {
        DisplayMenuState(ctx, this.menuState);
    }

    sound(timeModifier: number): void {
        const menuState: IMenuState = this.menuState;
        this.menuState = UpdateMenuState(timeModifier, menuState, {type:"SOUND", keys: null});
    }

    input(keys: KeyStateProvider, timeModifier: number): void {
        const menuData: IMenuState = this.menuState;
        // change state!!
        this.menuState = UpdateMenuState(timeModifier, menuData, {type:"INPUT", keys: keys.getKeys()});
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
