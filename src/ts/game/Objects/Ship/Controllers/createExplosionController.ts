import { IActor, Actor } from "ts/gamelib/Actors/Actor";
import { IShip, IWeapon } from "../../Ship/IShip";

export interface IExplosionControlInputs { ship: IShip;}

export function createExplosionController(get: () => IExplosionControlInputs): IActor {
    var c: IActor = new Actor(get, (inputs, lastTimeModifier: number) => {
        if (inputs.ship.crashed) {
            if (!inputs.ship.explosion.exploded) {
                inputs.ship.thrust.length = 0;
                inputs.ship.explosion.explosionParticleField.on = true;
                // exhaust with zero thrust creates trail of leaking debris which looks good.
                inputs.ship.exhaust.exhaustParticleField.on = true;
            }
        } else {
            inputs.ship.explosion.explosionParticleField.on = false;
        }
    });
    return c;
}