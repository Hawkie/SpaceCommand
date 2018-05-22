import { IActor, Actor } from "ts/gamelib/Actors/Actor";
import { Coordinate } from "ts/gamelib/Data/Coordinate";
import { Transforms } from "ts/gamelib/Physics/Transforms";
import { IParticle } from "ts/States/Asteroids/AsteroidFields";
import { Sound } from "ts/gamelib/Actors/Sound";
import { IShip, IWeapon } from "./ShipState";
import { Accelerator, IAcceleratorOutputs } from "../../../gamelib/Actors/Accelerator";

export interface IShipControlInputs {
    left: boolean;
    right: boolean;
    up: boolean;
    ship: IShip;
}

export interface IWeaponControlInputs {
    fire: boolean;
    ship: IShip;
    weapon: IWeapon;
}

export interface IExhaustControlInputs {
    up: boolean;
    ship: IShip;
}

export interface IExplosionControlInputs {
    ship: IShip;
}

export function createShipController(getInputs: () => IShipControlInputs): IActor {
    var c: IActor = new Actor(getInputs, (inputs, lastTimeModifier: number) => {
        if (!inputs.ship.crashed) {
            if (inputs.left) {
                inputs.ship.angle -= inputs.ship.maxRotationalSpeed * lastTimeModifier;
                // keep thrust vector in line with ship angle
                inputs.ship.thrust.angle = inputs.ship.angle;
            } else if (inputs.right) {
                inputs.ship.angle += inputs.ship.maxRotationalSpeed * lastTimeModifier;
                // keep thrust vector in line with ship angle
                inputs.ship.thrust.angle = inputs.ship.angle;
            }
            if (inputs.up) {
                inputs.ship.thrust.length = inputs.ship.maxForwardForce;
                inputs.ship.exhaust.exhaustParticleField.on = true;
            } else {
                inputs.ship.thrust.length = 0;
                inputs.ship.exhaust.exhaustParticleField.on = false;
            }
        }
    });
    return c;
}



export function createWeaponController(get: () => IWeaponControlInputs, set: (newBullet: IParticle) => void): IActor {
    var c: IActor = new Actor(get, (inputs, lastTimeModifier: number) => {
        if (!inputs.ship.crashed) {
            if (inputs.fire) {
                // put firerate check in here
                let now: number = Date.now();
                let elapsedTimeSec: number = (now - inputs.weapon.lastFired) / 1000;
                if (inputs.weapon.lastFired === undefined
                    || elapsedTimeSec >= 1 / 2) {
                    inputs.weapon.lastFired = now;
                    var cartesian: Coordinate = Transforms.VectorToCartesian(
                        inputs.ship.angle,
                        inputs.weapon.bulletVelocity);
                    var particle: IParticle = {
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