import { IGameObject, SingleGameObject } from "ts/GameObjects/GameObject";
import { IView } from "ts/Views/View";
import { ISprite } from "ts/Data/SpriteData";
import { ILocated } from "ts/Data/PhysicsData";
import { SpriteAngledView, SpriteView } from "ts/Views/SpriteView";
import { GraphicModel } from "ts/Models/DynamicModels";
import { IActor } from "ts/Actors/Actor";
import { Coordinate, Vector } from "ts/Physics/Common";



export class SpriteObject extends SingleGameObject<GraphicModel<ILocated, ISprite> > {
    constructor(located: ILocated, sprite: ISprite, actors: IActor[]) {
        var model = new GraphicModel<ILocated, ISprite> (located, sprite);
        var view: IView = new SpriteView(model.physics, model.graphic);
        super(model, [], [view]);
    }
}
