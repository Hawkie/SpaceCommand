import { Vector, OrthogonalVectors } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { IActor } from "ts/Actors/Actor";
import { ILocated, IMoving, IAngled, IForces } from "ts/Data/PhysicsData";


export class Accelerator implements IActor {

    constructor(private properties: IMoving, private forces: Vector[], private mass:number) { }

    update(timeModifer: number) {
        this.forces.forEach((f) => {
            let velChange = Transforms.VectorToCartesian(f.angle, f.length/this.mass * timeModifer);
            this.properties.velX += velChange.x;
            this.properties.velY += velChange.y;
        });
    }
}

export class CompositeAcceleratorError implements IActor {

    private barLength: number = 10;
    //private angularVel: number = 0;
    private angularForce: number = 0;
    constructor(private fromL: ILocated, private fromM: IMoving, private fromA: IAngled, private fromF: IForces, private toL: ILocated, private toM:IMoving, private toA: IAngled, private toF: IForces) { }

// from is ship
// to is ball
    update(timeModifer: number) {
        // work out angle from ship to ball 
        var x = this.toL.location.x - this.fromL.location.x;
        var y = this.toL.location.y - this.fromL.location.y;

        // invert y because of screen axis. 

        // http://math.stackexchange.com/questions/1201337/finding-the-angle-between-two-points
        // this produces correct angle after we have inverted y axis (as per screen resolutions)
        //var vecBallToShip = Transforms.CartesianToVector(-x, y);
        var vecShipToBall = Transforms.CartesianToVector(x, -y);
        var radShipToBall = vecShipToBall.angle / 180 * Math.PI;
        var Bsin = Math.sin(radShipToBall); // sin 0 = 0
        var Bcos = Math.cos(radShipToBall); // cos 0 = 1
        var totalMass = (this.fromF.mass + this.toF.mass);
                
        // Each for split to parallel and perpenticular forces
        // parallel to bar acts on sum of masses
        // perp to bar acts on own mass
        this.fromF.forces.forEach((f) => {
            // parallel cos x cos, y cos
            var diffAngle = vecShipToBall.angle - f.angle; // 0, 0 = 0
            var diffRadians = diffAngle / 180 * Math.PI; 

            // cos 0 = 1, cos 180 = -1, cos 90 = 0
            // sin 180 = 0, sin 90 = 1

// Change object velocities by input forces
// input forces translated to tangental and centripetal of ball and ship angle.

// Acceleration centipetal(Ac) and tangental(At)
            //var forceV = Transforms.VectorToAxis(f.angle, f.length, v.angle);
            var Dsin = Math.sin(diffRadians);
            var Dcos = Math.cos(diffRadians);
            var radForceAngle = f.angle / 180 * Math.PI;
           
// thrust Forces in alignment with centripetal (Fc) applied to ball and ship. = (*m / m)
            var Ac = Dcos * f.length / totalMass;
            var Vc = Ac * timeModifer;
            this.fromM.velX += Bsin * Vc;
            this.fromM.velY -= Bcos * Vc;
            this.toM.velX += Bsin * Vc;
            this.toM.velY -= Bcos * Vc;


// tangental forces (At) applied to angular velocity (Av) only.
            var Ft = Dsin * f.length;
            this.angularForce += Ft;
            
// convert centripetal velocities to centripetal forces for circular motions.
// Centripetal Force(Fc) = m * Av^2 / r           
            //this.angularVel += Vt;
// must find radius to centre of mass. Different for ball and ship.
            

    // this should be the total rotation vel not just ships
    // var v = Transforms.CartesianToVector(this.fromM.velX - this.toM.velX, -this.fromM.velY - this.toM.velY);
    // var vAnglediff = v.angle - vecShipToBall.angle;
    // var vAngleDiffRadians = vAnglediff / 180 * Math.PI;
    // var vPerp = Math.sin(vAngleDiffRadians) * v.length; // 90 -- 180 = 270 sin 270 = -1


        });

// force on ship            
        var ASt = this.angularForce / this.fromF.mass;
        var VSt = ASt * timeModifer;
        // vel on ship due to angular vel
        var VSx = 0;
        var VSy = 0
        VSx -= Bcos * VSt;
        VSy += Bsin * VSt
// vel on ship due to centipetal
        var cmShipRadius = vecShipToBall.length * (totalMass - this.fromF.mass)/totalMass;
        var FSc = this.fromF.mass * VSt * VSt  / cmShipRadius;
        var ASc = (FSc / this.fromF.mass);
        var VSc = ASc * timeModifer;
        VSx += Bsin * VSc;
        VSy += -Bcos * VSc;
        // apply angular vel to ship position
        this.fromL.location.x += VSx * timeModifer;
        this.fromL.location.y -= VSy * timeModifer;

// force on ball
        var ABt = this.angularForce / this.toF.mass;
        var VBt = ASt * timeModifer;
        // vel on ball due to angular vel
        var VBx = 0;
        var VBy = 0;
        VBx += -Bcos * -VBt;
        VBy += Bsin * -VBt;
// vel on ball due to centripetal
        var ABc = (-FSc / this.toF.mass);
        var VBc = ABc * timeModifer;
        VBx += Bsin * VBc / this.toF.mass;
        VBy += -Bcos * VBc / this.toF.mass;
        // apply vel to ball position
        this.toL.location.x += VBx * timeModifer;
        this.toL.location.y -= VBy * timeModifer;
    }
}

export class CompositeAccelerator implements IActor {

    private barLength: number = 40;
    private barAngleRadians: number = Math.PI;
    private angularForce: number = 0;
    constructor(private fromL: ILocated, private fromM: IMoving, private fromA: IAngled, private fromF: IForces, private toL: ILocated, private toM:IMoving, private toA: IAngled, private toF: IForces) { }

// from is ship
// to is ball
    update(timeModifer: number) {
        // work out angle from ship to ball 
        var x = this.toL.location.x - this.fromL.location.x;
        var y = this.toL.location.y - this.fromL.location.y;

        // invert y because of screen axis. 

        // http://math.stackexchange.com/questions/1201337/finding-the-angle-between-two-points
        // this produces correct angle after we have inverted y axis (as per screen resolutions)
        //var vecBallToShip = Transforms.CartesianToVector(-x, y);
        //var vecShipToBall = Transforms.CartesianToVector(x, -y);
        //var radShipToBall = this.barAngle / 180 * Math.PI;
        var Bsin = Math.sin(this.barAngleRadians); // sin 0 = 0
        var Bcos = Math.cos(this.barAngleRadians); // cos 0 = 1
        var totalMass = (this.fromF.mass + this.toF.mass);
                
        // Each for split to parallel and perpenticular forces
        // parallel to bar acts on sum of masses
        // perp to bar acts on own mass
        this.fromF.forces.forEach((f) => {
            // parallel cos x cos, y cos
            var diffRadians = this.barAngleRadians - f.angle / 180 * Math.PI; // 0, 0 = 0

            // cos 0 = 1, cos 180 = -1, cos 90 = 0
            // sin 180 = 0, sin 90 = 1

// Change object velocities by input forces
// input forces translated to tangental and centripetal of ball and ship angle.

// Acceleration centipetal(Ac) and tangental(At)
            //var forceV = Transforms.VectorToAxis(f.angle, f.length, v.angle);
            var Dsin = Math.sin(diffRadians);
            var Dcos = Math.cos(diffRadians);
            var radForceAngle = f.angle / 180 * Math.PI;
           
// thrust Forces in alignment with centripetal (Fc) applied to ball and ship. = (*m / m)
            var Ac = Dcos * f.length / totalMass;
            var Vc = Ac * timeModifer;
            this.fromM.velX += Bsin * Vc;
            this.fromM.velY -= Bcos * Vc;
            this.toM.velX += Bsin * Vc;
            this.toM.velY -= Bcos * Vc;


// tangental forces (At) applied to angular velocity (Av) only.
            var Ft = Dsin * f.length;
            this.angularForce += Ft;
            
// convert centripetal velocities to centripetal forces for circular motions.
// Centripetal Force(Fc) = m * Av^2 / r           
        });

// force on ship            
        var ASt = this.angularForce / this.fromF.mass;
        var VSt = ASt * timeModifer;
        // vel on ship due to angular vel
        var VSx = 0;
        var VSy = 0
        VSx -= Bcos * VSt;
        VSy += Bsin * VSt
// vel on ship due to centipetal
        var cmShipRadius = this.barLength * (totalMass - this.fromF.mass)/totalMass;
        var FSc = this.fromF.mass * Math.pow(VSt,2)  / cmShipRadius;
        var ASc = (FSc / this.fromF.mass);
        var VSc = ASc * timeModifer;
        VSx += Bsin * VSc;
        VSy -= Bcos * VSc;
        // apply angular vel to ship position
        this.fromL.location.x += VSx * timeModifer;
        this.fromL.location.y -= VSy * timeModifer;

// change tangental distance of ship
        var dsXst = VSt * timeModifer;
// change in angle swept by ship (cosine rule) cos(da) = a^2+b^2-c^2/2ab
        //var da1 = Math.pow(cmShipRadius,2)*2 - Math.pow(dsXst,2);
        //var da2 = 2 * Math.pow(cmShipRadius,2);
        //var da = Math.acos(da1/da2);

// using sin
        var da = Math.asin((dsXst/2)/cmShipRadius)*2; 
        this.barAngleRadians += da;

        var dx = Math.sin(this.barAngleRadians)* this.barLength;
        var dy = Math.cos(this.barAngleRadians)* this.barLength;
// apply vel to ball position
        
        this.toL.location.x = this.fromL.location.x + dx;
        this.toL.location.y = this.fromL.location.y - dy;
    }
}

