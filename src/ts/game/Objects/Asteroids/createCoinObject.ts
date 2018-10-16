import { ICoin } from "../../States/Asteroids/createAsteroidData";
import { IView } from "ts/gamelib/Views/View";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
import { IActor } from "ts/gamelib/Actors/Actor";
import { SpriteAnimator } from "ts/gamelib/Actors/SpriteAnimator";
import { Spinner } from "ts/gamelib/Actors/Spinner";
import { SpriteAngledView } from "ts/gamelib/Views/Sprites/SpriteView";

// creates a spinning coin
export function createCoinObject(getCoin: () => ICoin): SingleGameObject {
    var coin: ICoin = getCoin();
    var animator: IActor = new SpriteAnimator(coin.sprite, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0.1]);
    var spinner: Spinner = new Spinner(() => {
        return { spin: coin.spin };
    }, (sOut) => coin.angle += sOut.dAngle);
    var view: IView = new SpriteAngledView(() => {
        return {
            x: coin.x,
            y: coin.y,
            angle: coin.angle,
            sprite: coin.sprite,
        };
    });
    var coinObj: SingleGameObject = new SingleGameObject([animator, spinner], [view]);
    return coinObj;
}