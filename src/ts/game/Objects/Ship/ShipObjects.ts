import { IView } from "../../../gamelib/Views/View";
import { PolyView } from "../../../gamelib/Views/PolyViews";
import { LineView } from "../../../gamelib/Views/LineView";
import { MoveConstVelocity, IMoveOut } from "../../../gamelib/Actors/Movers";
import { SingleGameObject } from "../../../gamelib/GameObjects/SingleGameObject";
import { IActor } from "../../../gamelib/Actors/Actor";
import { PolyRotator } from "../../../gamelib/Actors/Rotators";
import { IShape } from "../../../gamelib/DataTypes/Shape";
import { createExplosionController } from "../../../../../src/ts/game/Objects/Ship/Controllers/createExplosionController";
// import { createShipController } from "../../../../../src/ts/game/Objects/Ship/Controllers/createShipController";
import { IShip } from "../../Components/Ship/ShipComponent";
import { addGravity } from "../../States/Shared/Gravity";
import Accelerator, { IAcceleratorOutputs, IAcceleratorInputs } from "../../../gamelib/Actors/Accelerator";
import { IGameStateConfig } from "../../../gamelib/GameState/IGameStateConfig";
import { Vector } from "../../../gamelib/DataTypes/Vector";
import { IAsteroidsControls } from "../../States/Asteroids/AsteroidsControlsComponent";

export function createShipObject(getStateConfig: () => IGameStateConfig,
    getControls: () => IAsteroidsControls,
    getShip: () => IShip): SingleGameObject {
    let stateConfig: IGameStateConfig = getStateConfig();
    let ship: IShip = getShip();

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

    // let shipView: IView = new PolyView(() => {
    //     return {
    //         x: ship.x,
    //         y: ship.y,
    //         shape: ship.shape,
    //     };
    // });

    let shipObj: SingleGameObject = new SingleGameObject([mover, rotator], []);
    // let shipController: IActor = createShipController(() => {
    //     return {
    //         left: controls.left,
    //         right: controls.right,
    //         up: controls.up,
    //         ship: ship,
    //     };
    // });
    let explosionController: IActor = createExplosionController(() => {
        return {
            ship: ship,
        };
    });
    shipObj.actors.push(explosionController);

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



