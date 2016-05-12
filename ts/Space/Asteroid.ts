import { Coordinate } from "../Physics/Common";
import { ShapeLocatedAngledMovingRotatingModel  } from "../Models/PolyModels";
import { IDrawable, Polygon } from "../DisplayObjects/DisplayObject"
import { MovingSpinningObject } from "../GameObjects/SpaceObject";
import { PolyView } from "../Views/PolyViews";
import { Transforms } from "../Physics/Transforms";

export class AsteroidModel extends ShapeLocatedAngledMovingRotatingModel {
    constructor(collisionPoly: Coordinate[], location: Coordinate, velx: number, vely: number, angle: number, spin: number) {
        super(collisionPoly, location, velx, vely, angle, spin);
    }
}