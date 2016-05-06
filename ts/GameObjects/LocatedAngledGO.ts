import { DrawContext } from "../Common/DrawContext";
import { IDrawable, IDrawableAndRotatable } from "../DisplayObjects/DisplayObject";
import { GeneralRotator, PolyRotator } from "../Actors/Rotators";
import { Mover } from "../Actors/Movers";
import { Coordinate } from "../Common/Coordinate";
import { Transforms } from "../Common/Transforms";
import { LocatedGO, IAngled, IGameObject } from "../GameObjects/GameObject";


export class LocatedAngledGO extends LocatedGO implements IAngled {
    // add method policy here
    private rotator: IGameObject;

    constructor(protected drawable: IDrawableAndRotatable, public location: Coordinate, public angle: number = 0) {
        super(drawable, location);
        this.rotator = new PolyRotator(this, drawable);
    }

    update(timeModifier: number) {
        super.update(timeModifier);
        this.rotator.update(timeModifier);
    }

    // does not call superclass on purpose!
    display(drawContext: DrawContext) {
        this.rotator.display(drawContext);
    }
}