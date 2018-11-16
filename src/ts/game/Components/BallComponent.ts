import { CircleView, DrawCircle } from "../../gamelib/Views/CircleView";
import { SingleGameObject } from "../../gamelib/GameObjects/SingleGameObject";
import { IView } from "../../gamelib/Views/View";
import { DrawContext } from "../../gamelib/1Common/DrawContext";
import { MoveConstVelocity, move, IMoveIn, IMoveOut, MoveWithVelocity } from "../../gamelib/Actors/Movers";

export interface IBall {
    x: number;
    y: number;
    Vx: number;
    Vy: number;
    r: number;
    mass: number;
}

export function CreateBall(x: number, y: number): IBall {
    let ballData: IBall = {
        x: x,
        y: y,
        Vx: 0,
        Vy: 0,
        mass: 1,
        r: 10,
    };
    return ballData;
}

export function DisplayBall(ctx: DrawContext, ball:IBall): void {
    DrawCircle(ctx,
            ball.x,
            ball.y,
            ball.r);
}

export function UpdateBall(timeModifier: number, ball: IBall): IBall {
    return MoveWithVelocity(timeModifier, ball, ball.Vx, ball.Vy);
}

