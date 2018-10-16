import { Vector } from "ts/gamelib/Data/Vector";
import { Transforms } from "ts/gamelib/Physics/Transforms";
import { IActor } from "ts/gamelib/Actors/Actor";
// import { ILocated, IMoving, IAngled, IForces } from "ts/gamelib/Data/PhysicsData";

export interface IRodInputs {
        readonly xFrom: number;
        readonly yFrom: number;
        readonly VxFrom: number;
        readonly VyFrom: number;
        readonly massFrom: number;
        readonly forces: Vector[];
        readonly xTo: number;
        readonly yTo: number;
        readonly VxTo: number;
        readonly VyTo: number;
        readonly massTo: number;
}

export interface IRodOutputs {
        dxFrom: number;
        dyFrom: number;
        dVxFrom: number;
        dVyFrom: number;
        xTo: number;
        yTo: number;
}


export class CompositeAccelerator implements IActor {

    private barLength: number = 40;
    private angularForce: number = 0;
    // private barAngleRadians: number = Math.PI;
    // constructor(private fromL: ILocated, private fromM: IMoving, private fromA: IAngled, private fromF: IForces,
    // private toL: ILocated, private toM:IMoving) { }

    constructor(private getInputs: ()=> IRodInputs, private setOutputs: (out: IRodOutputs)=> void) {
    }

    update(timeModifer: number): void {
        var rIn: IRodInputs = this.getInputs();
        var rOut: IRodOutputs = this.applyRod(timeModifer, rIn);
        this.setOutputs(rOut);
    }
// from is ship
// to is ball
    applyRod(timeModifer: number, rIn: IRodInputs): IRodOutputs  {

        // work out angle from ship to ball
        // var x = this.toL.location.x - this.fromL.location.x;
        // var y = this.toL.location.y - this.fromL.location.y;
        var x: number = rIn.xTo - rIn.xFrom;
        var y: number = rIn.yTo - rIn.yFrom;
        // invert y because of screen axis.

        // http://math.stackexchange.com/questions/1201337/finding-the-angle-between-two-points
        // this produces correct angle after we have inverted y axis (as per screen resolutions)
        // var vecBallToShip = Transforms.CartesianToVector(-x, y);
        var bar: Vector = Transforms.CartesianToVector(x, -y);
        var barAngleRadians: number = bar.angle / 180 * Math.PI;
        var Bsin: number = Math.sin(barAngleRadians); // sin 0 = 0
        var Bcos: number = Math.cos(barAngleRadians); // cos 0 = 1
        var totalMass: number = (rIn.massFrom + rIn.massTo);

        var out: IRodOutputs = {
                dxFrom: 0,
                dyFrom: 0,
                dVxFrom: 0,
                dVyFrom: 0,
                xTo: 0,
                yTo: 0,
        };
        // each for split to parallel and perpenticular forces
        // parallel to bar acts on sum of masses
        // perp to bar acts on own mass
        rIn.forces.forEach((f) => {
            // parallel cos x cos, y cos
            var diffRadians: number = barAngleRadians - f.angle / 180 * Math.PI; // 0, 0 = 0

            // cos 0 = 1, cos 180 = -1, cos 90 = 0
            // sin 180 = 0, sin 90 = 1

// change object velocities by input forces
// input forces translated to tangental and centripetal of ball and ship angle.

// acceleration centipetal(Ac) and tangental(At)
            // var forceV = Transforms.VectorToAxis(f.angle, f.length, v.angle);
            var Dsin: number = Math.sin(diffRadians);
            var Dcos: number = Math.cos(diffRadians);
            var radForceAngle: number = f.angle / 180 * Math.PI;

// thrust Forces in alignment with centripetal (Fc) applied to ball and ship. = (*m / m)
            var Ac: number = Dcos * f.length / totalMass;
            var Vc: number = Ac * timeModifer;

            // changes to Vel in direction of rod
        //     this.fromM.velX += Bsin * Vc;
        //     this.fromM.velY -= Bcos * Vc;
                // out.dVxTo += Bsin * Vc;
                // out.dVyTo -= Bcos * Vc;
                out.dVxFrom += Bsin * Vc;
                out.dVyFrom -= Bcos * Vc;

// tangental forces (Ft) applied to angular Force (Av) only.
            var Ft: number = Dsin * f.length;
            this.angularForce += Ft;

// convert centripetal velocities to centripetal forces for circular motions.

        });

// tangental acceleration on ship (ASt)
        var ASt: number = this.angularForce / rIn.massFrom;
        var VSt: number = ASt * timeModifer;
        // vel on ship due to angular vel
        var VSx: number = 0;
        var VSy: number = 0;
        VSx -= Bcos * VSt;
        VSy += Bsin * VSt;

        // vel on ship due to centipetal
        var cmShipRadius: number = this.barLength * (totalMass - rIn.massFrom) / totalMass;

        // centripetal Force(FSc) = m * Av^2 / r
        var FSc: number = rIn.massFrom * Math.pow(VSt, 2)  / cmShipRadius;
        var ASc: number = (FSc / rIn.massFrom);
        var VSc: number = ASc * timeModifer;
        VSx += Bsin * VSc;
        VSy -= Bcos * VSc;

        // changes apply angular vel to ship position
        // this.fromL.location.x += VSx * timeModifer;
        // this.fromL.location.y -= VSy * timeModifer;

        out.dxFrom += VSx * timeModifer;
        out.dyFrom -= VSy * timeModifer;

// change tangental distance of ship
        var dsXst: number = VSt * timeModifer;

// using sin
        var da: number = Math.asin((dsXst/2)/cmShipRadius)*2;
        barAngleRadians += da;

        var dx: number = Math.sin(barAngleRadians)* this.barLength;
        var dy: number = Math.cos(barAngleRadians)* this.barLength;

// calc position of ball
        // this.toL.location.x = this.fromL.location.x + dx;
        // this.toL.location.y = this.fromL.location.y - dy;

        out.xTo = rIn.xFrom + out.dxFrom + dx;
        out.yTo = rIn.yFrom + out.dyFrom - dy;
        return out;
    }
}

