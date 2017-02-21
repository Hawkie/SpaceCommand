import { ILocatedAngled, LocatedMovingData } from "ts/Data/PhysicsData";
import { IInteractor } from "ts/Interactors/Interactor";
import { Vector, OrthogonalVectors, Coordinate } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";


export class RodInteractor implements IInteractor {
    constructor(private model1: ILocatedAngled, private model2: ILocatedAngled, private callBack: (number, model1, model2) => void) { }

    // get the vel1 and vel2 of model1 and model2
    // decompose vel1 to vector component (r1) acting on rod
    // and angular momentum (am1) perpendicular to rod 
    // decompose vel2 to vector component (r2) acting on rod
    // and angular momentum (am2) perpendicular to rod
    // add r1 and r2. That is result on both objects
    // add am
    test(lastTestModifier: number): void {

        //var ab = Transforms.VectorToAxis(this.model2.angle, this.model1.)
        //    this.callBack(lastTestModifier, this.model1, this.model2);
    }
}