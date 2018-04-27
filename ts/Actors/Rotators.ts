import { IActor } from "ts/Actors/Actor";
import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate, ICoordinate } from "ts/Data/Coordinate";
import { IShape } from "ts/Data/Shape";
// import { ILocated, IAngled, IAngledRotating } from "ts/Data/PhysicsData";
import { Transforms } from "ts/Physics/Transforms";

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

export interface ISpinnerInputs {
    spin: number;
}

export interface ISpinnerOutputs {
    dAngle: number;
}

export class Spinner implements IActor {
    constructor(private getIn:()=>ISpinnerInputs, private setOut: (out: ISpinnerOutputs)=> void) {
    }

    update(timeModifier: number): void {
        var sOut:ISpinnerOutputs = Spinner.spin(timeModifier, this.getIn());
        this.setOut(sOut);
    }

    static spin(timeModifier: number, sIn: ISpinnerInputs): ISpinnerOutputs {
        return {
            dAngle: sIn.spin * timeModifier
        };
    }
}

