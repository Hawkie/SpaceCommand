import { IActor } from "ts/Actors/Actor";
import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate } from "ts/Physics/Common";
import { IShape } from "ts/Data/ShapeData";
import { ILocated, IAngled, IAngledRotating } from "ts/Data/PhysicsData";
import { Transforms } from "ts/Physics/Transforms";


export class PolyRotator implements IActor {
    private previousAngle: number;
    
    constructor(private data: IAngled, private shape: IShape) {
        this.previousAngle = 0;
    }

    update(timeModifier: number) {
        if (this.previousAngle != this.data.angle) {
            var rotateAngle = this.data.angle - this.previousAngle
            // rotate the difference
            var newPoints = Transforms.Rotate(this.shape.points, rotateAngle);
            var newOffset = Transforms.Rotate([this.shape.offset], rotateAngle);
            this.shape.points = newPoints;
            this.shape.offset = newOffset[0];
            this.previousAngle = this.data.angle;
        }
    }
}

export interface ISpinnerInputs {
    spin: number;
}

export interface ISpinnerOutputs {
    dAngle: number;
}

export class Spinner2 implements IActor {
    constructor(private getIn:()=>ISpinnerInputs, private setOut: (out: ISpinnerOutputs)=> void) {
    }

    update(timeModifier: number): void {
        var sOut:ISpinnerOutputs = Spinner2.spin(timeModifier, this.getIn());
        this.setOut(sOut);
    }

    static spin(timeModifier: number, sIn: ISpinnerInputs): ISpinnerOutputs {
        return {
            dAngle: sIn.spin * timeModifier
        };
    }
}


export class Spinner implements IActor {
    constructor(private properties: IAngledRotating) {
    }

    update(timeModifier: number) {
        this.properties.angle += this.properties.spin * timeModifier;
    }
}
