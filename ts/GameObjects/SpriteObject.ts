import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { IView } from "ts/Views/View";
import { ISprite } from "ts/Data/SpriteData";
import { ILocated } from "ts/Data/PhysicsData";
import { SpriteAngledView, SpriteView } from "ts/Views/SpriteView";
import { SpriteModel } from "ts/Models/Graphic/SpriteModel";
import { IActor } from "ts/Actors/Actor";
import { Coordinate, Vector } from "ts/Physics/Common";

export class SpriteObject extends GameObject<SpriteModel> {
    constructor(located: ILocated, sprite: ISprite, actors: IActor[]) {
        var model = new SpriteModel(located, sprite, actors);
        var view: IView = new SpriteView(model.data, model.graphic);
        super(model, [view]);
    }
}
