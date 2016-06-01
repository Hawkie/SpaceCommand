import { IActor } from "ts/Actors/Actor";
import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate } from "ts/Physics/Common";
import { IShape } from "ts/Data/ShapeData";
import { ILocated, IAngled, IAngledRotating } from "ts/Data/PhysicsData";
import { IDrawable, IRotatable } from "ts/DisplayObjects/DisplayObject";
import { Transforms } from "ts/Physics/Transforms";

export class PolyRotator implements IActor {
    private previousAngle: number;
    
    constructor(private data: IAngled, private shape: IShape) {
        this.previousAngle = data.angle;
    }

    update(timeModifier: number) {
        if (this.previousAngle != this.data.angle) {
            var rotateAngle = this.data.angle - this.previousAngle
            // rotate the difference
            var newPoints = Transforms.Rotate(this.shape.points, rotateAngle);
            this.shape.points = newPoints;
            this.previousAngle = this.data.angle;
        }
    }
}



export class Spinner implements IActor {
    constructor(private properties: IAngledRotating) {
    }

    update(timeModifier: number) {
        this.properties.angle += this.properties.spin * timeModifier;
    }
}
