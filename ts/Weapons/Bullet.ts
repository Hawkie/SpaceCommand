import { IGameObject, LocatedAngledMovingGO } from "../GameObjects/GameObject"
import { IDrawable, Rect } from "../DisplayObjects/DisplayObject"
import { Coordinate} from "../Physics/Common"
import { Transforms } from "../Physics/Transforms"
import { DrawContext } from "../Common/DrawContext"

export class Bullet extends LocatedAngledMovingGO {
    
    constructor(location: Coordinate, angle: number, velocity: number) {

        let drawable = new Rect(1,1); 
        var vector = Transforms.VectorToCartesian(angle, velocity)
        super(drawable, location, vector.x, vector.y, 0);
    }
}

