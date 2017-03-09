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

export class CompositeAccelerator implements IActor {

    constructor(private fromL: ILocated, private fromM: IMoving, private fromA: IAngled, private fromF: IForces, private toL: ILocated, private toM:IMoving, private toA: IAngled, private toF: IForces) { }

    update(timeModifer: number) {
        // work out angle of rod
        var x = this.toL.location.x - this.fromL.location.x;
        var y = this.fromL.location.y - this.toL.location.y;

        var length = Math.sqrt(x * x + y * y);
        var barRadians = Math.atan2(x, y);
        var barDegrees = barRadians * 180 / Math.PI;
        //var barVector = Transforms.CartesianToVector(x, y);
        //var barRadians = barVector.angle / 180 * Math.PI;
        
        // Each for split to parallel and perpenticular forces
        // parallel to bar acts on sum of masses
        // perp to bar acts on own mass
        this.fromF.forces.forEach((f) => {
            // parallel cos x cos, y cos
            var diffAngle = barDegrees - f.angle;
            var diffRadians = diffAngle / 180 * Math.PI;
            // cos and sin are anticlockwise whereas my angles are clockwise.
            // use -
            var diffSin = Math.sin(-diffRadians); // sin 0 = 0, sin 90 = 1
            var diffCos = Math.cos(-diffRadians); // cos 0 = 1, cos 90 = 0
            var sin = -Math.sin(-barRadians); // sin 0 = 0
            var cos = -Math.cos(-barRadians); // cos 0 = 1
            //var forceV = Transforms.VectorToAxis(f.angle, f.length, v.angle);
            var aParallellToBar = diffCos * f.length / (this.fromF.mass + this.toF.mass);
            var aPerpToBar = diffSin * f.length / (this.fromF.mass );

            // par = cos (x= sin, y = cos)
            this.fromM.velX += sin * aParallellToBar * timeModifer;
            this.fromM.velY += cos * aParallellToBar * timeModifer;
            this.toM.velX += sin * aParallellToBar * timeModifer;
            this.toM.velY += cos * aParallellToBar * timeModifer;

            // perp = sin (x = cos, y = sin)
            
            this.fromM.velX -= cos * aPerpToBar * timeModifer;
            this.fromM.velY += sin * aPerpToBar * timeModifer;
            //this.toM.velX += cos * aPerpToBar * timeModifer;
            //this.toM.velY -= sin * aPerpToBar * timeModifer;
        });
    }
}
