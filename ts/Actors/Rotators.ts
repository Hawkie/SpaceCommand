import { IActor } from "../Actors/Actor";
import { DrawContext } from "../Common/DrawContext";
import { Coordinate } from "../Physics/Common";
import { ILocated, IShapeAngled, IShapeAngledRotating } from "../Models/PolyModels";
import { IDrawable, IRotatable } from "../DisplayObjects/DisplayObject";
import { Transforms } from "../Physics/Transforms";



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
