import { DrawContext } from "ts/Common/DrawContext";
import { IActor } from "ts/Actors/Actor";
import { IView } from "ts/Views/PolyViews";

export interface IGameObject extends IActor, IView { }

export class GameObject<ModelT> implements IGameObject {    
    constructor(public model: ModelT, private actors: IActor[], private views: IView[]) {
    }

    update(timeModifier: number) {
        this.actors.forEach(a => a.update(timeModifier));
    }

    display(drawContext: DrawContext) {
        this.views.forEach(e => e.display(drawContext));
    }
}

