import { IView } from "../../../gamelib/Views/View";
import { MultiGameObject } from "../../../gamelib/GameObjects/MultiGameObject";
import { SingleGameObject } from "../../../gamelib/GameObjects/SingleGameObject";
import { IActor } from "../../../gamelib/Actors/Actor";
import { createParticleField } from "../Particle/createParticleField";
import { Sound } from "../../../../../src/ts/gamelib/Actors/Sound";
import { ScreenFlashView } from "../../../gamelib/Views/ScreenFlashView";
import { Flasher } from "../../../gamelib/Actors/Switches";
import { Timer } from "../../../gamelib/Actors/Timers";
import { IShip } from "./IShip";

// creates a two particle fields to represent the ship exploding.
// turns on when the ship crashes.
export function createExplosionObj(getShip: () => IShip): MultiGameObject<SingleGameObject> {
    let ship: IShip = getShip();
    let explosionObj: MultiGameObject<SingleGameObject> = createParticleField(ship.explosion.explosionParticleField, () => {
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
    let explosionSound: IActor = new Sound(ship.explosion.soundFilename, true, false, () => {
        return {
            play: ship.explosion.explosionParticleField.on,
        };
    });
    explosionObj.actors.push(explosionSound);
    let flashView: IView = new ScreenFlashView(() => {
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
    let flasher: IActor = new Flasher(() => {
        return {
            enabled: ship.crashed,
            value: ship.explosion.flash.flashScreenValue,
            repeat: ship.explosion.flash.flashRepeat,
        };
    }, (value: number) => {
        ship.explosion.flash.flashScreenValue = value;
    });
    explosionObj.actors.push(flasher);
    let timerTurnOff: IActor = new Timer(() => {
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