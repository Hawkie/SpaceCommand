import { IActor, Actor } from "../../Actors/Actor";
import { IAsteroidState, IShip, IWeapon } from "./AsteroidModels";
import { Coordinate } from "../../Physics/Common";
import { Transforms } from "../../Physics/Transforms";
import { IParticle } from "../../GameObjects/ParticleField";
import { Sound } from "../../Actors/Sound";

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


export class AsteroidActors {
    static createShipController(getInputs:()=>IShipControlInputs): IActor {
        var c: IActor = new Actor(getInputs, (inputs, lastTimeModifier: number)=> {
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
                    inputs.ship.exhaust.on = true;
                    // state.ship.on();
                } else {
                    inputs.ship.thrust.length = 0;
                    inputs.ship.exhaust.on = false;
                    // state.ship.off();
                }
            }
        });
        return c;
    }

    static createWeaponController(get:()=>IWeaponControlInputs, set:(newBullet:IParticle)=>void): IActor {
        var c: IActor = new Actor(get, (inputs, lastTimeModifier: number)=> {
            if (!inputs.ship.crashed) {
                if (inputs.fire) {
                    // put firerate check in here
                    let now: number = Date.now();
                    let elapsedTimeSec: number = (now - inputs.weapon.lastFired)/1000;
                    if (inputs.weapon.lastFired === undefined
                        || elapsedTimeSec >= 1/2) {
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
//         this.bulletField.components.push(pObj);
    //         this.laserSound.play();
    //     }
    // }

    static createExplosionController(get:()=>IExplosionControlInputs): IActor {
        var c: IActor = new Actor(get, (inputs, lastTimeModifier: number)=> {
            if (inputs.ship.crashed) {
                inputs.ship.thrust.length = 0;
                inputs.ship.explosion.on = true;
                // exhaust with zero thrust creates trail of leaking debris which looks good.
                inputs.ship.exhaust.on = true;
            } else {
                inputs.ship.explosion.on = false;
            }
        });
        return c;
    }

}