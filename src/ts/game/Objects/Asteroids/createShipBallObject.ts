import { IBall } from "../../States/Asteroids/AsteroidModels";
import { LineView } from "ts/gamelib/Views/PolyViews";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
import { CompositeAccelerator, IRodOutputs } from "ts/gamelib/Actors/Accelerators";
import { IShip } from "../Ship/IShip";

// create a ship and ball attached by a line with a composite accelerator to
// handle the physics between the two objects
export function createShipBallObject(getShip: () => IShip, getBall: () => IBall): SingleGameObject {
    var ship: IShip = getShip();
    var ball: IBall = getBall();
    var rod: CompositeAccelerator = new CompositeAccelerator(() => {
        return {
            xFrom: ship.x,
            yFrom: ship.y,
            VxFrom: ship.Vx,
            VyFrom: ship.Vy,
            forces: [ship.thrust],
            massFrom: ship.mass,
            xTo: ball.x,
            yTo: ball.y,
            VxTo: ball.Vx,
            VyTo: ball.Vy,
            massTo: ball.mass
        };
    }, (out: IRodOutputs) => {
        ship.x += out.dxFrom;
        ship.y += out.dyFrom;
        ship.Vx += out.dVxFrom;
        ship.Vy += out.dVyFrom;
        ball.x = out.xTo;
        ball.y = out.yTo;
    });
    // create rod view as a line from ball to ship
    var line: LineView = new LineView(() => {
        return {
            xFrom: ball.x,
            yFrom: ball.y,
            xTo: ship.x,
            yTo: ship.y,
        };
    });
    var r: SingleGameObject = new SingleGameObject([rod], [line]);
    return r;
}