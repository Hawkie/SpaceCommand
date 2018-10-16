import { IView } from "ts/gamelib/Views/View";
import { MultiGameObject } from "ts/gamelib/GameObjects/MultiGameObject";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
import { IActor } from "ts/gamelib/Actors/Actor";
import { createParticleField } from "ts/game/States/Asteroids/AsteroidFields";
import { Sound } from "ts/gamelib/Actors/Sound";
import { ScreenFlashView } from "../../../gamelib/Views/ScreenFlashView";
import { Flasher } from "ts/gamelib/Actors/Switches";
import { Timer } from "ts/gamelib/Actors/Timers";
import { IShip } from "./IShip";
export function createExplosionObj(getShip: () => IShip): MultiGameObject<SingleGameObject> {
    var ship: IShip = getShip();
    var explosionObj: MultiGameObject<SingleGameObject> = createParticleField(ship.explosion.explosionParticleField, () => {
        return {
            on: ship.explosion.explosionParticleField.on,
            x: ship.x,
            xOffset: ship.shape.offset.x,
            xLowSpread: -2,
            xHighSpread: 2,
            y: ship.y,
            yOffset: ship.shape.offset.y,
            yLowSpread: -2,
            yHighSpread: 2,
            Vx: ship.Vx,
            vXLowSpread: -10,
            vXHighSpread: 10,
            Vy: ship.Vy,
            vYLowSpread: -10,
            vYHighSpread: 10,
        };
    });
    var explosionSound: IActor = new Sound(ship.explosion.soundFilename, true, false, () => {
        return {
            play: ship.explosion.explosionParticleField.on,
        };
    });
    explosionObj.actors.push(explosionSound);
    var flashView: IView = new ScreenFlashView(() => {
        return {
            x: 0,
            y: 0,
            width: 480,
            height: 512,
            on: ship.crashed,
            value: ship.explosion.flash.flashScreenValue,
        };
    });
    explosionObj.views.push(flashView);
    // add flasher to value so screen changes
    var flasher: IActor = new Flasher(() => {
        return {
            enabled: ship.crashed,
            value: ship.explosion.flash.flashScreenValue,
            repeat: ship.explosion.flash.flashRepeat,
        };
    }, (value: number) => {
        ship.explosion.flash.flashScreenValue = value;
    });
    explosionObj.actors.push(flasher);
    var timerTurnOff: IActor = new Timer(() => {
        return {
            enabled: ship.crashed,
            limit: ship.explosion.explosionLifetime,
        };
    }, () => {
        ship.explosion.explosionParticleField.on = false;
        ship.explosion.exploded = true;
    });
    explosionObj.actors.push(timerTurnOff);
    return explosionObj;
}