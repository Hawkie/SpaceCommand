import { IBall } from "../../States/Asteroids/createAsteroidData";
import { IView } from "ts/gamelib/Views/View";
import { CircleView } from "ts/gamelib/Views/CircleView";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
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