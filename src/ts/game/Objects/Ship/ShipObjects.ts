import { AsteroidModels, IParticleField, IControls } from "../../States/Asteroids/createAsteroidData";
import { IView } from "ts/gamelib/Views/View";
import { PolyView } from "ts/gamelib/Views/PolyViews";
import { LineView } from "ts/gamelib/Views/LineView";
import { MoveConstVelocity, IMoveOut } from "ts/gamelib/Actors/Movers";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
import { IActor } from "ts/gamelib/Actors/Actor";
import { PolyRotator } from "ts/gamelib/Actors/Rotators";
import { IShape } from "ts/gamelib/Data/Shape";
import { createExplosionController } from "ts/game/Objects/Ship/Controllers/createExplosionController";
import { createShipController } from "ts/game/Objects/Ship/Controllers/createShipController";
import { createWrapActor } from "ts/gamelib/Actors/Wrap";
import { IShip } from "./IShip";
import { addGravity } from "../../States/Shared/Gravity";
import Accelerator, { IAcceleratorOutputs, IAcceleratorInputs } from "../../../gamelib/Actors/Accelerator";
import { IGameStateConfig } from "../../../gamelib/GameState/IGameStateConfig";
import { Vector } from "../../../gamelib/Data/Vector";

export function createShipObject(getStateConfig: () => IGameStateConfig,
    getControls: () => IControls,
    getShip: () => IShip): SingleGameObject {
    var stateConfig: IGameStateConfig = getStateConfig();
    var ship: IShip = getShip();
    var controls: IControls = getControls();
    var mover: IActor = new MoveConstVelocity(() => {
        return {
            Vx: ship.Vx,
            Vy: ship.Vy,
        };
    }, (out: IMoveOut) => {
        ship.x += out.dx;
        ship.y += out.dy;
    });
    // adding ship rotator
    var rotator: IActor = new PolyRotator(() => {
        return {
            angle: ship.angle,
            shape: ship.shape,
        };
    }, (out: IShape) => {
        ship.shape = out;
    });

    var shipView: IView = new PolyView(() => {
        return {
            x: ship.x,
            y: ship.y,
            shape: ship.shape,
        };
    });

    var shipObj: SingleGameObject = new SingleGameObject([mover, rotator], [shipView]);
    var shipController: IActor = createShipController(() => {
        return {
            left: controls.left,
            right: controls.right,
            up: controls.up,
            ship: ship,
        };
    });
    var explosionController: IActor = createExplosionController(() => {
        return {
            ship: ship,
        };
    });
    shipObj.actors.push(shipController, explosionController);
    if (stateConfig.screenWrap) {
        var wrapx: IActor = createWrapActor(() => {
            return {
                value: ship.x,
                lowLimit: 0,
                upLimit: 512,
            };
        }, (a) => ship.x = a);
        var wrapy: IActor = createWrapActor(() => {
            return {
                value: ship.y,
                lowLimit: 0,
                upLimit: 480,
            };
        }, (a) => ship.y = a);
        shipObj.actors.push(wrapx, wrapy);
    }

    // add Gravity
    if (ship.gravityStrength !== 0) {
        var getAcceleratorProps: () => IAcceleratorInputs = () => {
            return {
                x: ship.x,
                y: ship.y,
                Vx: ship.Vx,
                Vy: ship.Vy,
                forces: [new Vector(180, ship.gravityStrength)],
                mass: ship.mass
            };
        };
        var gravity: Accelerator = new Accelerator(getAcceleratorProps, (out: IAcceleratorOutputs) => {
            ship.Vx += out.dVx;
            ship.Vy += out.dVy;
        });
        shipObj.actors.push(gravity);
    }
    return shipObj;
}

export function createShipAccelerator(getShip: () => IShip): SingleGameObject {
    var ship: IShip = getShip();

    var thrust: Accelerator = new Accelerator(() => {
        return {
            x: ship.x,
            y: ship.y,
            Vx: ship.Vx,
            Vy: ship.Vy,
            forces: [ship.thrust],
            mass: ship.mass,
        };
    }, (out: IAcceleratorOutputs) => {
        ship.Vx += out.dVx;
        ship.Vy += out.dVy;
    });
    return new SingleGameObject([thrust],[]);
}



