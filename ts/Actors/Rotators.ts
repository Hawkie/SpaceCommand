import { IActor } from "../Actors/Actor";
import { DrawContext } from "../Common/DrawContext";
import { Coordinate } from "../Common/Coordinate";
import { IGameObject, ILocated, ILocatedAndAngled } from "../GameObjects/GameObject";
import { IDrawable, IDrawableAndRotatable } from "../DisplayObjects/DisplayObject";



export class PolyRotator implements IActor {
    private previousAngle: number;
    
    constructor(private properties: ILocatedAndAngled, private drawable: IDrawableAndRotatable) {
        this.previousAngle = properties.angle;
    }


    update(timeModifier: number) {
        if (this.previousAngle != this.properties.angle) {
            // rotate the difference
            this.drawable.rotate(this.properties.angle- this.previousAngle);
            this.previousAngle = this.properties.angle;
        }
    }

    display(drawContext: DrawContext) {
        this.drawable.draw(this.properties.location, drawContext);
    }
}