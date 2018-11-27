import { DrawContext } from "../../gamelib/1Common/DrawContext";
import { DrawGraphicAngled } from "../../gamelib/Views/GraphicView";
import { Game } from "../../gamelib/1Common/Game";

export interface IGraphicShip {
    readonly x: number;
    readonly y: number;
    readonly Vx: number;
    readonly Vy: number;
    readonly angle: number;
    readonly spin: number;
    readonly mass: number;
    readonly graphic: string;
}

export function CreateGraphicShip(x: number, y:number): IGraphicShip {
    let gShip: IGraphicShip = {
        x: x,
        y: y,
        Vx: 0,
        Vy: 0,
        angle: 10,
        spin: 0,
        mass: 1,
        graphic: "res/img/ship.png",
    };
    return gShip;
}

export function DisplayGraphicShip(ctx: DrawContext, graphicShip: IGraphicShip): void {
    DrawGraphicAngled(ctx, graphicShip.x,graphicShip.y, graphicShip.angle, Game.assets.graphicShip);
}