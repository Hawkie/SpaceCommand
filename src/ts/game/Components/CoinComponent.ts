import { IAnimator, UpdateAnimator, UpdateSprite } from "../../gamelib/Actors/SpriteAnimator";
import { ISprite, HorizontalSpriteSheet } from "../../gamelib/DataTypes/Sprite";
import { DrawContext } from "../../gamelib/1Common/DrawContext";
import { Game } from "../Game/Game";
import { DrawSpriteAngled } from "../../gamelib/Views/Sprites/SpriteAngledView";
import { ITimer } from "../../gamelib/Actors/Timers";
import { UpdateAngle, spin } from "../../gamelib/Actors/Spinner";


export interface ICoin {
    readonly x: number;
    readonly y: number;
    readonly Vx: number;
    readonly Vy: number;
    readonly angle: number;
    readonly spin: number;
    readonly sprite: ISprite; // state
    readonly animator: IAnimator; // state
    readonly animationSequence: number[]; // config
    readonly animationDuration: number; // config
}

export function CreateCoin(x: number, y: number): ICoin {
    let s: ISprite = new HorizontalSpriteSheet(46, 42, 10, 0, 0.5, 0.5);
    let coin: ICoin = {
        x: x,
        y: y,
        Vx: 0,
        Vy: 0,
        angle: 45,
        spin: 45,
        sprite: s,
        animator: {
            elapsedTime: 0,
            animationCounter: 0,
        },
        animationSequence: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        animationDuration: 0.1,
    };
    return coin;
}

// move graphic part of sprite to assetsg
export function DisplayCoin(ctx: DrawContext, coin: ICoin): void {
    DrawSpriteAngled(ctx, coin.x, coin.y, coin.angle, coin.sprite, Game.assets.coinSprite);
}

export function UpdateCoin(timeModifier: number, coin: ICoin): ICoin {
    let a:IAnimator = UpdateAnimator(timeModifier, coin.animator, coin.animationDuration, coin.animationSequence);
    return Object.assign({}, coin, {
        animator: a,
        sprite: UpdateSprite(timeModifier, coin.sprite, coin.animationSequence[a.animationCounter]),
        angle: coin.angle + timeModifier * coin.spin,
    });
}