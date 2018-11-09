import { IActor, Actor } from "../../../../gamelib/Actors/Actor";
import { Coordinate } from "../../../../gamelib/DataTypes/Coordinate";
import { Transforms } from "../../../../gamelib/Physics/Transforms";
import { IParticle } from "ts/game/Objects/Particle/IParticle";
import { IShip, IWeapon } from "../../Ship/IShip";

export interface IWeaponControlInputs {
    fire: boolean;
    ship: IShip;
    weapon: IWeapon;
}

// creates a controller that accepts a fire control and uses ship and weapon
// to create bullets as a particle field
export function createWeaponController(get: () => IWeaponControlInputs, set: (newBullet: IParticle) => void): IActor {
    let c: IActor = new Actor(get, (inputs, lastTimeModifier: number) => {
        if (!inputs.ship.crashed) {
            if (inputs.fire) {
                // put firerate check in here
                let now: number = Date.now();
                let elapsedTimeSec: number = (now - inputs.weapon.lastFired) / 1000;
                if (inputs.weapon.lastFired === undefined
                    || elapsedTimeSec >= 1 / 2) {
                    inputs.weapon.lastFired = now;
                    let cartesian: Coordinate = Transforms.VectorToCartesian(inputs.ship.angle, inputs.weapon.bulletVelocity);
                    let particle: IParticle = {
                        x: inputs.ship.x,
                        y: inputs.ship.y,
                        Vx: cartesian.x,
                        Vy: cartesian.y,
                        born: now,
                        size: 2,
                    };
                    set(particle);
                }
            }
        }
    });
    return c;
}