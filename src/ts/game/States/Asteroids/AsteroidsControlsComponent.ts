import { Keys } from "../../../gamelib/1Common/KeyStateProvider";

export interface IAsteroidsControls {
    left: boolean;
    right: boolean;
    up: boolean;
    fire: boolean;
    zoomIn: boolean;
    zoomOut: boolean;
    exit: boolean;
}

export function InputAsteroidControls(keys:number[]): IAsteroidsControls {
    let controls: IAsteroidsControls = {
        left: false,
        right: false,
        up: false,
        fire: false,
        zoomIn: false,
        zoomOut: false,
        exit: false,
    };
    if (keys.indexOf(Keys.UpArrow) > -1) {
        controls.up = true;
    }
    if (keys.indexOf(Keys.LeftArrow) > -1) {
        controls.left = true;
    }
    if (keys.indexOf(Keys.RightArrow) > -1) {
        controls.right = true;
    }
    if (keys.indexOf(Keys.SpaceBar) > -1) {
        controls.fire = true;
    }
    if (keys.indexOf(Keys.Z) > -1) {
        controls.zoomIn = true;
    }
    if (keys.indexOf(Keys.X) > -1) {
        controls.zoomOut = true;
    }
    if (keys.indexOf(Keys.Esc) > -1) {
        controls.exit = true;
    }
    return controls;
}