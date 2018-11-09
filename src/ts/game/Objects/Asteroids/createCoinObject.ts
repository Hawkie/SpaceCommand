import { ICoin } from "../../States/Asteroids/createAsteroidData";
import { IView } from "../../../gamelib/Views/View";
import { SingleGameObject } from "../../../gamelib/GameObjects/SingleGameObject";
import { IActor } from "../../../gamelib/Actors/Actor";
import { SpriteAnimator } from "../../../gamelib/Actors/SpriteAnimator";
import { Spinner } from "../../../gamelib/Actors/Spinner";
import { SpriteAngledView } from "../../../gamelib/Views/Sprites/SpriteAngledView";

// creates a spinning coin
export function createCoinObject(getCoin: () => ICoin): SingleGameObject {
    let coin: ICoin = getCoin();
    let animator: IActor = new SpriteAnimator(coin.sprite, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0.1]);
    let spinner: Spinner = new Spinner(() => {
        return { spin: coin.spin };
    }, (sOut) => coin.angle += sOut.dAngle);
    let view: IView = new SpriteAngledView(() => {
        return {
            x: coin.x,
            y: coin.y,
            angle: coin.angle,
            sprite: coin.sprite,
        };
    });
    let coinObj: SingleGameObject = new SingleGameObject([animator, spinner], [view]);
    return coinObj;
}