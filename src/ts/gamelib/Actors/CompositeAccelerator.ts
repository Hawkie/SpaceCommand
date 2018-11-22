import { Vector } from "../../../../src/ts/gamelib/DataTypes/Vector";
import { Transforms } from "../../../../src/ts/gamelib/Physics/Transforms";

export interface IConnected {
        readonly x: number;
        readonly y: number;
        readonly Vx: number;
        readonly Vy: number;
        readonly xTo: number;
        readonly yTo: number;
        readonly angularForce: number;
}

const barLength: number = 40;

export function UpdateConnection<T extends IConnected>(twoObjects: T,
        timeModifer: number,
        massFrom: number,
        forces: Vector[],
        massTo: number): T {

    // work out angle from ship to ball
    // let x = this.toL.location.x - this.fromL.location.x;
    // let y = this.toL.location.y - this.fromL.location.y;
    let x: number = twoObjects.xTo - twoObjects.x;
    let y: number = twoObjects.yTo - twoObjects.y;

    // http://math.stackexchange.com/questions/1201337/finding-the-angle-between-two-points
    // this produces correct angle after we have inverted y axis (as per screen resolutions)
    // let vecBallToShip = Transforms.CartesianToVector(-x, y);
    // invert y because of screen axis.
    let bar: Vector = Transforms.CartesianToVector(x, -y);
    let barAngleRadians: number = bar.angle / 180 * Math.PI;
    let Bsin: number = Math.sin(barAngleRadians); // sin 0 = 0
    let Bcos: number = Math.cos(barAngleRadians); // cos 0 = 1
    let totalMass: number = (massFrom + massTo);

    let dxFrom: number =0;
    let dyFrom: number =0;
    let dVxFrom: number =0;
    let dVyFrom: number =0;
    let dxTo: number =0;
    let dyTo: number =0;
    let angularForce: number = twoObjects.angularForce;
    // each for split to parallel and perpenticular forces
    // parallel to bar acts on sum of masses
    // perp to bar acts on own mass
    forces.forEach((f) => {
        // parallel cos x cos, y cos
        let diffRadians: number = barAngleRadians - f.angle / 180 * Math.PI; // 0, 0 = 0

        // cos 0 = 1, cos 180 = -1, cos 90 = 0
        // sin 180 = 0, sin 90 = 1

    // change object velocities by input forces
    // input forces translated to tangental and centripetal of ball and ship angle.

    // acceleration centipetal(Ac) and tangental(At)
        // let forceV = Transforms.VectorToAxis(f.angle, f.length, v.angle);
        let Dsin: number = Math.sin(diffRadians);
        let Dcos: number = Math.cos(diffRadians);
        let radForceAngle: number = f.angle / 180 * Math.PI;

    // thrust Forces in alignment with centripetal (Fc) applied to ball and ship. = (*m / m)
        let Ac: number = Dcos * f.length / totalMass;
        let Vc: number = Ac * timeModifer;

        // changes to Vel in direction of rod
        //     this.fromM.velX += Bsin * Vc;
        //     this.fromM.velY -= Bcos * Vc;
        // out.dVxTo += Bsin * Vc;
        // out.dVyTo -= Bcos * Vc;
        dVxFrom += Bsin * Vc;
        dVyFrom -= Bcos * Vc;

    // tangental forces (Ft) applied to angular Force (Av) only.
        let Ft: number = Dsin * f.length;
        angularForce += Ft;

    // convert centripetal velocities to centripetal forces for circular motions.

    });

// tangental acceleration on ship (ASt)
        let ASt: number = angularForce / massFrom;
        let VSt: number = ASt * timeModifer;
        // vel on ship due to angular vel
        let VSx: number = 0;
        let VSy: number = 0;
        VSx -= Bcos * VSt;
        VSy += Bsin * VSt;

        // vel on ship due to centipetal
        let cmShipRadius: number = barLength * (totalMass - massFrom) / totalMass;

        // centripetal Force(FSc) = m * Av^2 / r
        let FSc: number = massFrom * Math.pow(VSt, 2)  / cmShipRadius;
        let ASc: number = (FSc / massFrom);
        let VSc: number = ASc * timeModifer;
        VSx += Bsin * VSc;
        VSy -= Bcos * VSc;

        // changes apply angular vel to ship position
        // this.fromL.location.x += VSx * timeModifer;
        // this.fromL.location.y -= VSy * timeModifer;

        dxFrom += VSx * timeModifer;
        dyFrom -= VSy * timeModifer;

// change tangental distance of ship
        let dsXst: number = VSt * timeModifer;

// using sin
        let da: number = Math.asin((dsXst/2)/cmShipRadius)*2;
        barAngleRadians += da;

        let dx: number = Math.sin(barAngleRadians)* barLength;
        let dy: number = Math.cos(barAngleRadians)* barLength;

// calc position of ball
        // this.toL.location.x = this.fromL.location.x + dx;
        // this.toL.location.y = this.fromL.location.y - dy;

        return Object.assign({}, twoObjects, {
                x: twoObjects.x + dxFrom,
                y: twoObjects.y + dyFrom,
                Vx: twoObjects.Vx + dVxFrom,
                Vy: twoObjects.Vy + dVyFrom,
                xTo: twoObjects.x + dxTo + dx,
                yTo: twoObjects.y + dyTo - dy,
                angularForce: angularForce,
        });
}

