import { DrawContext } from "../../gamelib/1Common/DrawContext";
import { Game2 } from "../../gamelib/1Common/Game2";

export interface IView {
    zoomSpeed: number;
    viewScale: number;
    zoomLevel: number;
    followObject: boolean;
}
export interface IDisplayBehaviour<TState> {
    displayState: (ctx: DrawContext, state: TState) => void;
}

export function CreateView(followObject: boolean): IView {
    return {
        zoomSpeed: 0.01,
        viewScale: 1,
        zoomLevel: 1,
        followObject: followObject,
    };
}

// if zoom = 1 no change
// if zoom > 1 then drawing origin moves to -ve figures and object coordinates can start off the top left of screen
// if zoom < 1 then drawing origin moves to +ve figires and coordinates offset closer into screen
export function Zoom(view: IView, zoomIn:boolean, zoomOut: boolean): IView {
    let viewScale: number = view.viewScale;
    if (zoomIn) {
        viewScale = view.zoomSpeed;
    } else if (zoomOut) {
        viewScale = -view.zoomSpeed;
    } else {
        viewScale = 0;
    }
    return {...view,
        zoomLevel: view.zoomLevel = view.zoomLevel * (1 + viewScale)
    };
}

export function DisplayView<TState>(ctx:DrawContext, view: IView,
    x: number, y: number, state: TState, d: IDisplayBehaviour<TState>): void {
    ctx.save();
    // move origin to location of ship - location of ship factored by zoom
    if (view.followObject) {
        ctx.translate(Game2.assets.width/2 - x, Game2.assets.height/2 - y);
    }
    ctx.translate(x * (1 - view.zoomLevel), y * (1 - view.zoomLevel));
    ctx.zoom(view.zoomLevel, view.zoomLevel);
    // displayAsteroidsState(ctx, this.state);
    d.displayState(ctx, state);
    ctx.restore();
}