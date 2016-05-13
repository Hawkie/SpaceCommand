import { IActor } from "ts/Actors/Actor";
import { DrawContext } from "ts/Common/DrawContext";
import { Coordinate } from "ts/Physics/Common";
import { ILocated, IShapeAngled, IShapeAngledRotating } from "ts/Models/PolyModels";
import { IDrawable, IRotatable } from "ts/DisplayObjects/DisplayObject";
import { Transforms } from "ts/Physics/Transforms";



export class PolyRotator implements IActor {
    private previousAngle: number;
    
    constructor(private properties: IShapeAngled) {
        this.previousAngle = properties.angle;
    }

    update(timeModifier: number) {
        if (this.previousAngle != this.properties.angle) {
            var rotateAngle = this.properties.angle - this.previousAngle
            // rotate the difference
            var newPoints = Transforms.Rotate(this.properties.points, rotateAngle);
            this.properties.points = newPoints;
            this.previousAngle = this.properties.angle;
        }
    }
}

export class Spinner implements IActor {
    constructor(private properties: IShapeAngledRotating) {
    }

    update(timeModifier: number) {
        this.properties.angle += this.properties.spin * timeModifier;
    }
}
