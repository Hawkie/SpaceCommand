import { IActor } from "../../../../src/ts/gamelib/Actors/Actor";
import { Coordinate, ICoordinate } from "../../../../src/ts/gamelib/DataTypes/Coordinate";
import { IShape } from "../../../../src/ts/gamelib/DataTypes/Shape";
import { Transforms } from "../../../../src/ts/gamelib/Physics/Transforms";

export interface IPolyRotator {
    shape: IShape;
    angle: number;
}

// todo - use in and out functions
export class PolyRotator implements IActor {
    private previousAngle: number;
    constructor(private getInputs: () => IPolyRotator, private setOut:(out: IShape)=>void) {
        this.previousAngle = 0;
    }

    update(timeModifier: number): void {
        let inputs: IPolyRotator = this.getInputs();
        if (this.previousAngle !== inputs.angle) {
            let rotateAngle: number = inputs.angle - this.previousAngle;
            // rotate the difference
            let newPoints: ICoordinate[] = Transforms.Rotate(inputs.shape.points, rotateAngle);
            let newOffset: ICoordinate = Transforms.Rotate([inputs.shape.offset], rotateAngle).pop();
            this.previousAngle = inputs.angle;
            this.setOut({points: newPoints, offset: newOffset});
        }
    }
}

export function RotateShape<T extends IPolyRotator>(timeModifier: number, hasShape: T, angularVelocity: number): T {
    return Object.assign({}, hasShape, {
        shape: RotatePoly(timeModifier, hasShape.shape, angularVelocity)
    });
}

export function RotatePoly<T extends IShape>(timeModifier: number, shape: T, angularVelocity: number): T {
    let rotateAngle: number = angularVelocity * timeModifier;
    // rotate the difference
    let newPoints: ICoordinate[] = Transforms.Rotate(shape.points, rotateAngle);
    let newOffset: ICoordinate = Transforms.Rotate([shape.offset], rotateAngle).pop();
    return Object.assign({}, shape, {
        points: newPoints,
        offset: newOffset});
}




