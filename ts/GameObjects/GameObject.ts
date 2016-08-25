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

export interface IComponentObjects<TModel> extends IGameObject {
    components: IGameObject[];
}
    

export class SingleGameObject<TModel> implements IGameObject, IObject<TModel> {    
    constructor(public model: TModel, public actors: IActor[], public views: IView[]) {
    }

    update(timeModifier: number) {
        this.actors.forEach(a => a.update(timeModifier));
    }

    display(drawContext: DrawContext) {
        this.views.forEach(e => e.display(drawContext));
    }
}

export class ComponentObjects<TObject extends IGameObject> implements IComponentObjects<TObject> {
    constructor(public components: TObject[]) {
    }

    update(timeModifier: number) {
        this.components.forEach(a => a.update(timeModifier));
    }

    display(drawContext: DrawContext) {
        this.components.forEach(e => e.display(drawContext));
    }
}


// combi of single and component
export class MultiGameObject<TModel, TComponent extends IGameObject> implements IGameObject, IObject<TModel> {
    constructor(public model: TModel, public actors: IActor[], public views: IView[], public components: TComponent[] = []) {
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