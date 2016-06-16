import { Coordinate } from "ts/Physics/Common";
import { IActor } from "ts/Actors/Actor"

import { ILocated, LocatedData } from "ts/Data/PhysicsData";
import { ISprite, SpriteFrame, Sprite, HorizontalSpriteSheet } from "ts/Data/SpriteData";
import { GraphicModel } from "ts/Models/DynamicModels";

export class SpriteModel extends GraphicModel<ILocated, ISprite> {
    constructor(data: ILocated, sprite: ISprite, animators: IActor[]) {
        super(data, sprite, animators);
    }
}
