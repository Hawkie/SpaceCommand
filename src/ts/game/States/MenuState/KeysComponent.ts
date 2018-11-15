import { Keys } from "../../../gamelib/1Common/KeyStateProvider";

export interface IMenuControl {
    up: boolean;
    down: boolean;
    enter: boolean;
}

export function reduceKeys(timeModifier: number, keys: number[]): IMenuControl {
    let controls: IMenuControl = {
        up: false,
        down: false,
        enter: false,
    };
    if (keys.indexOf(Keys.UpArrow) > -1) {
        controls.up = true;
    }
    if (keys.indexOf(Keys.DownArrow) > -1) {
        controls.down = true;
    }
    if (keys.indexOf(Keys.Enter) > -1) {
        controls.enter = true;
    }
    return controls;
}