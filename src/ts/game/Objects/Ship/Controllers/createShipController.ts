import { IActor, Actor } from "../../../../gamelib/Actors/Actor";
import { IShip, IWeapon } from "../../Ship/IShip";

export interface IShipControlInputs {
    left: boolean;
    right: boolean;
    up: boolean;
    ship: IShip;
}

// create controller that accepts left, right and up controlls and applies them to the ship object
// uses ship control inputs as the source of the ship configuration
export function createShipController(getInputs: () => IShipControlInputs): IActor {
    let c: IActor = new Actor(getInputs, (inputs, lastTimeModifier: number) => {
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