import { IActor } from "ts/gamelib/Actors/Actor";
import { Coordinate, ICoordinate } from "ts/gamelib/Data/Coordinate";
import { IShape } from "ts/gamelib/Data/Shape";
import { Transforms } from "ts/gamelib/Physics/Transforms";

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
        var inputs: IPolyRotator = this.getInputs();
        if (this.previousAngle !== inputs.angle) {
            var rotateAngle: number = inputs.angle - this.previousAngle;
            // rotate the difference
            var newPoints: ICoordinate[] = Transforms.Rotate(inputs.shape.points, rotateAngle);
            var newOffset: ICoordinate = Transforms.Rotate([inputs.shape.offset], rotateAngle).pop();
            this.previousAngle = inputs.angle;
            this.setOut({points: newPoints, offset: newOffset});
        }
    }
}




