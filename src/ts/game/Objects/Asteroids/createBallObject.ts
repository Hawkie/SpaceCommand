import { IBall } from "../../States/Asteroids/createAsteroidData";
import { IView } from "ts/gamelib/Views/View";
import { CircleView } from "ts/gamelib/Views/CircleView";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
export function createBallObject(getBall: () => IBall): SingleGameObject {
    var ball: IBall = getBall();
    var ballView: IView = new CircleView(() => {
        return {
            x: ball.x,
            y: ball.y,
            r: ball.r,
        };
    });
    var obj: SingleGameObject = new SingleGameObject([], [ballView]);
    return obj;
}