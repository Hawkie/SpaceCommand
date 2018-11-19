import { DrawContext } from "../../gamelib/1Common/DrawContext";
import { Game } from "../Game/Game";
import { DrawGraphicAngled } from "../../gamelib/Views/GraphicView";

export interface IGraphicShip {
    x: number;
    y: number;
    Vx: number;
    Vy: number;
    angle: number;
    spin: number;
    mass: number;
    graphic: string;
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