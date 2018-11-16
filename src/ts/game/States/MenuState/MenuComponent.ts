import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { DrawText } from "../../../gamelib/Views/TextView";
import { IMenuControl } from "./KeysComponent";
import { IMenuState } from "./createMenuData";
import { Game } from "../../Game/Game";

export interface IMenu {
    lastMoved: number;
    selected: boolean;
    itemFocus: number;
    moved: boolean;
    font: string;
    fontSize: number;
    menuItems: string[];
}

export function menuToView(ctx: DrawContext, x: number, y: number, menu: IMenu): void {
    // todo: crude for loop
    for (let i: number = 0; i < menu.menuItems.length; i++) {
        if (menu.itemFocus === i) {
            DrawText(ctx, x-20, y, ">", menu.font, menu.fontSize);
        }
        DrawText(ctx, x, y, menu.menuItems[i], menu.font, menu.fontSize);
        y += 50;
    }
}

export function menuToSound(menuState: IMenu): IMenu {
    Game.assets.timePortal.playOnce();
    if (menuState.moved) {
        Game.assets.blast.replay();
    }
    return Object.assign({}, menuState, {
        moved: false
    });
}

// pure function that takes a menu action and updates the selected text. returns new menu
export function reduceMenu(timeModifier: number, menu: IMenu, controls: IMenuControl): IMenu {
    let now: number = Date.now();
    let focus: number = menu.itemFocus;
    let moved: boolean = false;
    if ((now - menu.lastMoved) > 150) {
        if (controls.up) {
            focus = Math.max(menu.itemFocus - 1, 0);
            moved = true;
        }
        if (controls.down) {
            focus = Math.min(menu.itemFocus + 1, menu.menuItems.length - 1);
            moved = true;
        }
        // change state of menu focus
        return Object.assign({}, menu, {
            itemFocus: focus,
            selected: controls.enter,
            lastMoved: now,
            moved: moved,
        });
    }
    // return copy of menmu
    return Object.assign({}, menu);
}
