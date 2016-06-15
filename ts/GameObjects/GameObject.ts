import { DrawContext } from "ts/Common/DrawContext";
import { IActor } from "ts/Actors/Actor";
import { IView } from "ts/Views/View";

export interface IGameObject extends IActor, IView { }

export class GameObject<TModel extends IActor> implements IGameObject {    
    constructor(public model: TModel, private views: IView[]) {
    }

    update(timeModifier: number) {
        this.model.update(timeModifier);
    }

    display(drawContext: DrawContext) {
        this.views.forEach(e => e.display(drawContext));
    }
}

