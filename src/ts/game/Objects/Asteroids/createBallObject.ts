
import { IView } from "../../../gamelib/Views/View";
import { CircleView } from "../../../gamelib/Views/CircleView";
import { SingleGameObject } from "../../../gamelib/GameObjects/SingleGameObject";
import { IBall } from "../../Components/BallComponent";
export function createBallObject(getBall: () => IBall): SingleGameObject {
    let ball: IBall = getBall();
    let ballView: IView = new CircleView(() => {
        return {
            x: ball.x,
            y: ball.y,
            r: ball.r,
        };
    });
    let obj: SingleGameObject = new SingleGameObject([], [ballView]);
    return obj;
}