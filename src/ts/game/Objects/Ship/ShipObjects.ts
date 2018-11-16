import { AsteroidModels, IParticleField, IControls } from "../../States/Asteroids/AsteroidState";
import { IView } from "../../../gamelib/Views/View";
import { PolyView } from "../../../gamelib/Views/PolyViews";
import { LineView } from "../../../gamelib/Views/LineView";
import { MoveConstVelocity, IMoveOut } from "../../../gamelib/Actors/Movers";
import { SingleGameObject } from "../../../gamelib/GameObjects/SingleGameObject";
import { IActor } from "../../../gamelib/Actors/Actor";
import { PolyRotator } from "../../../gamelib/Actors/Rotators";
import { IShape } from "../../../gamelib/DataTypes/Shape";
import { createExplosionController } from "../../../../../src/ts/game/Objects/Ship/Controllers/createExplosionController";
import { createShipController } from "../../../../../src/ts/game/Objects/Ship/Controllers/createShipController";
import { createWrapActor } from "../../../gamelib/Actors/Wrap";
import { IShip } from "./IShip";
import { addGravity } from "../../States/Shared/Gravity";
import Accelerator, { IAcceleratorOutputs, IAcceleratorInputs } from "../../../gamelib/Actors/Accelerator";
import { IGameStateConfig } from "../../../gamelib/GameState/IGameStateConfig";
import { Vector } from "../../../gamelib/DataTypes/Vector";

export function createShipObject(getStateConfig: () => IGameStateConfig,
    getControls: () => IControls,
    getShip: () => IShip): SingleGameObject {
    let stateConfig: IGameStateConfig = getStateConfig();
    let ship: IShip = getShip();
    let controls: IControls = getControls();
    let mover: IActor = new MoveConstVelocity(() => {
        return {
            Vx: ship.Vx,
            Vy: ship.Vy,
        };
    }, (out: IMoveOut) => {
        ship.x += out.dx;
        ship.y += out.dy;
    });
    // adding ship rotator
    let rotator: IActor = new PolyRotator(() => {
        return {
            angle: ship.angle,
            shape: ship.shape,
        };
    }, (out: IShape) => {
        ship.shape = out;
    });

    let shipView: IView = new PolyView(() => {
        return {
            x: ship.x,
            y: ship.y,
            shape: ship.shape,
        };
    });

    let shipObj: SingleGameObject = new SingleGameObject([mover, rotator], [shipView]);
    let shipController: IActor = createShipController(() => {
        return {
            left: controls.left,
            right: controls.right,
            up: controls.up,
            ship: ship,
        };
    });
    let explosionController: IActor = createExplosionController(() => {
        return {
            ship: ship,
        };
    });
    shipObj.actors.push(shipController, explosionController);
    if (stateConfig.screenWrap) {
        let wrapx: IActor = createWrapActor(() => {
            return {
                value: ship.x,
                lowLimit: 0,
                upLimit: 512,
            };
        }, (a) => ship.x = a);
        let wrapy: IActor = createWrapActor(() => {
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
        let getAcceleratorProps: () => IAcceleratorInputs = () => {
            return {
                x: ship.x,
                y: ship.y,
                Vx: ship.Vx,
                Vy: ship.Vy,
                forces: [new Vector(180, ship.gravityStrength)],
                mass: ship.mass
            };
        };
        let gravity: Accelerator = new Accelerator(getAcceleratorProps, (out: IAcceleratorOutputs) => {
            ship.Vx += out.dVx;
            ship.Vy += out.dVy;
        });
        shipObj.actors.push(gravity);
    }
    return shipObj;
}

export function createShipAccelerator(getShip: () => IShip): SingleGameObject {
    let ship: IShip = getShip();

    let thrust: Accelerator = new Accelerator(() => {
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



