import { Keys } from "../../../gamelib/1Common/KeyStateProvider";

export interface IMenuControls {
    readonly up: boolean;
    readonly down: boolean;
    readonly enter: boolean;
}

export function UpdateMenuControls(timeModifier: number, keys: number[]): IMenuControls {
    let up: boolean = false;
    let down: boolean = false;
    let enter: boolean = false;
    if (keys.indexOf(Keys.UpArrow) > -1) {
        up = true;
    }
    if (keys.indexOf(Keys.DownArrow) > -1) {
        down = true;
    }
    if (keys.indexOf(Keys.Enter) > -1) {
        enter = true;
    }
    return {
        up: up,
        down: down,
        enter: enter,
    };
}