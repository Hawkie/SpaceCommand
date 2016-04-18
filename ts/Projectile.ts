import { IGameObject, MovingGameObject } from "./Common/GameObject"
import { IDisplayObject, Rect } from "./Common/DisplayObject"
import { Coordinate} from "./Common/Coordinate"
import { Transforms } from "./Common/Transforms"
import { DrawContext } from "./Common/DrawContext"

export class Bullet extends MovingGameObject {
    static velocity : number = 128;
    constructor(location : Coordinate, angle : number){
        let displayObject = new Rect(1,1);
        
        var vector = Transforms.toVector(angle, Bullet.velocity)
        super(displayObject, location, vector.x, vector.y, 0, 0);
    }
}

