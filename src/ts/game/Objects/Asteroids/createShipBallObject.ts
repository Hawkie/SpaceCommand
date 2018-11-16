import { LineView } from "../../../gamelib/Views/LineView";
import { SingleGameObject } from "../../../gamelib/GameObjects/SingleGameObject";
import { CompositeAccelerator, IRodOutputs } from "../../../gamelib/Actors/CompositeAccelerator";
import { IShip } from "../Ship/ShipComponent";
import { IBall } from "../../Components/BallComponent";

// create a ship and ball attached by a line with a composite accelerator to
// handle the physics between the two objects
export function createShipBallObject(getShip: () => IShip, getBall: () => IBall): SingleGameObject {
    let ship: IShip = getShip();
    let ball: IBall = getBall();
    let rod: CompositeAccelerator = new CompositeAccelerator(() => {
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
    // let line: LineView = new LineView(() => {
    //     return {
    //         xFrom: ball.x,
    //         yFrom: ball.y,
    //         xTo: ship.x,
    //         yTo: ship.y,
    //     };
    // });
    let r: SingleGameObject = new SingleGameObject([rod], []);
    return r;
}