import { CircleView, DisplayCircle } from "../../../gamelib/Views/CircleView";
import { SingleGameObject } from "../../../gamelib/GameObjects/SingleGameObject";
import { IBall, createBallData } from "../../States/Asteroids/createAsteroidData";
import { IView } from "../../../gamelib/Views/View";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { MoveConstVelocity, move, IMoveIn, IMoveOut } from "../../../gamelib/Actors/Movers";

export type IViewFn = (ctx: DrawContext) => void;
export type IActFn = (timeModifier: number) => void;

export function BallData(x: number, y: number): IBall {
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

export function BallViewFn(ballData: ()=> IBall): IViewFn {
    let ballView: IViewFn = (ctx: DrawContext) => DisplayCircle(ctx,
            ballData().x,
            ballData().y,
            ballData().r);
    return ballView;
}

export function BallMove(ballData: ()=> IBall): IActFn {
    let ballMove: IActFn = (timeModifier: number) => {
        let d: IMoveOut = move(timeModifier,
            ballData().Vx,
            ballData().Vy);
        // create new ball data after all the changes above
        let reducer: IBall = createBallData(
            ballData().x + d.dx,
            ballData().y + d.dy);
    };
    return ballMove;
}

// ball.move(ball.take(x,y));
// ball.accelerate()
