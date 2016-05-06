import { IGameObject, MovingGameObject } from "../Common/GameObject"
import { IDrawable, Rect } from "../DisplayObjects/DisplayObject"
import { Coordinate} from "../Common/Coordinate"
import { Transforms } from "../Common/Transforms"
import { DrawContext } from "../Common/DrawContext"

export class Bullet extends MovingGameObject {
    
    constructor(location: Coordinate, angle: number, velocity: number) {

        let drawable = new Rect(1,1); 
        var vector = Transforms.VectorToCartesian(angle, velocity)
        super(drawable, location, vector.x, vector.y, 0, 0);
    }
}

