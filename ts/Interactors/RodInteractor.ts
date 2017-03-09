import { ILocated, IAngled, IForces, LocatedMovingData } from "ts/Data/PhysicsData";
import { IInteractor } from "ts/Interactors/Interactor";
import { Vector, OrthogonalVectors, Coordinate } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";


export class RodInteractor implements IInteractor {
    constructor(private fromL: ILocated, private fromA:IAngled, private fromF:IForces, private toL: ILocated, private toA: IAngled, private toF:IForces, private callBack: (number, model1, model2) => void) { }

    // get the force1 and force2 of model1 and model2
    // decompose force1 to vector component (r1) acting on rod
    // and angular momentum (am1) perpendicular to rod 
    // decompose force2 to vector component (r2) acting on rod
    // and angular momentum (am2) perpendicular to rod
    // add r1 and r2. That is result on both objects
    // add am
    test(lastTestModifier: number): void {

    // work out angle of rod
        var x = this.toL.location.x - this.fromL.location.x;
        var y = this.fromL.location.y - this.toL.location.y;
        var v = Transforms.CartesianToVector(x, y);

        // Each for split to parallel and perpenticular forces
        // parallel to bar acts on sum of masses
        // perp to bar acts on own mass
        this.fromF.forces.forEach((f) => {
            var forceV = Transforms.VectorToAxis(f.angle, f.length, v.angle);
            var accelerationParallel = forceV.parallel / (this.fromF.mass + this.toF.mass);
            var accelerationPerp = forceV.perpendicular / (this.fromF.mass);
        });
        //var ab = Transforms.VectorToAxis(this.model2.angle, this.model1.)
        //    this.callBack(lastTestModifier, this.model1, this.model2);
    }
}