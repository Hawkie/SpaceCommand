import { DrawContext } from "../../gamelib/1Common/DrawContext";
import { DrawText } from "../../gamelib/Views/TextView";
import { IMenuControls } from "../States/MenuState/MenuControlsComponent";
import { Game } from "../Game/Game";
import { IAudioObject } from "../../gamelib/Elements/AudioObject";

// immutable data object
export interface IMenu {
    readonly lastMoved: number;
    readonly selected: boolean;
    readonly itemFocus: number;
    readonly moved: boolean;
    readonly font: string;
    readonly fontSize: number;
    readonly menuItems: string[];
}


export function DisplayMenu(ctx: DrawContext, x: number, y: number, menu: IMenu): void {
    // todo: crude for loop
    for (let i: number = 0; i < menu.menuItems.length; i++) {
        if (menu.itemFocus === i) {
            DrawText(ctx, x-20, y, ">", menu.font, menu.fontSize);
        }
        DrawText(ctx, x, y, menu.menuItems[i], menu.font, menu.fontSize);
        y += 50;
    }
}

export function SoundMenu(menuState: IMenu, music: IAudioObject, change: IAudioObject): IMenu {
    music.playOnce();
    if (menuState.moved) {
        change.replay();
    }
    return {...menuState,
        moved: false
    };
}

// pure function that takes a menu action and updates the selected text. returns new menu
export function UpdateMenu(timeModifier: number, menu: IMenu, controls: IMenuControls): IMenu {
    let now: number = Date.now();
    let focus: number = menu.itemFocus;
    let moved: boolean = false;
    if (now-menu.lastMoved > 150) {
        if (controls.up) {
            focus = Math.max(menu.itemFocus - 1, 0);
            moved = true;
        }
        if (controls.down) {
            focus = Math.min(menu.itemFocus + 1, menu.menuItems.length - 1);
            moved = true;
        }
        // change state of menu focus
        return {...menu,
            itemFocus: focus,
            selected: controls.enter,
            lastMoved: now,
            moved: moved,
        };
    }
    // return menu unchanged
    return menu;
}
