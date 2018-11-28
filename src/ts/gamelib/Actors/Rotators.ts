
import { ICoordinate } from "../../../../src/ts/gamelib/DataTypes/Coordinate";
import { IShape } from "../../../../src/ts/gamelib/DataTypes/Shape";
import { Transforms } from "../../../../src/ts/gamelib/Physics/Transforms";

export interface IAngled {
    angle: number;
}

export interface IAngledShape extends IAngled {
    shape: IShape;
}

export function RotateAngle<T extends IAngled>(angled: T, spin:number, timeModifier: number): T {
    return Object.assign({},  angled, {
        angle: angled.angle + spin * timeModifier,
    });
}

export function RotateShape<T extends IAngledShape>(timeModifier: number, hasShape: T, angularVelocity: number): T {
    return Object.assign({}, hasShape, {
        shape: RotatePoly(timeModifier, hasShape.shape, angularVelocity)
    });
}

export function RotatePoly<T extends IShape>(timeModifier: number, shape: T, angularVelocity: number): T {
    let rotateAngle: number = angularVelocity * timeModifier;
    // rotate the difference
    let newPoints: ICoordinate[] = Transforms.RotateCoordinates(shape.points, rotateAngle);
    let newOffset: ICoordinate = Transforms.RotateCoordinates([shape.offset], rotateAngle).pop();
    return Object.assign({}, shape, {
        points: newPoints,
        offset: newOffset});
}




