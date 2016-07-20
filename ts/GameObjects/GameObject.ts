import { DrawContext } from "ts/Common/DrawContext";
import { IActor } from "ts/Actors/Actor";
import { IView } from "ts/Views/View";

export interface IGameObject extends IActor, IView {
}

export interface IObject<TModel> extends IGameObject {
    actors: IActor[];
    views: IView[];
    model: TModel;
}

export interface ICompositeObject<TModel> extends IObject<TModel> {
    components: IGameObject;
}
    

export class GameObject<TModel> implements IGameObject {    
    constructor(public model: TModel, public actors: IActor[], public views: IView[], public components: IGameObject[] = []) {
    }

    update(timeModifier: number) {
        this.components.forEach(a => a.update(timeModifier));
        this.actors.forEach(a => a.update(timeModifier));
    }

    display(drawContext: DrawContext) {
        this.components.forEach(e => e.display(drawContext));
        this.views.forEach(e => e.display(drawContext));
    }
}
