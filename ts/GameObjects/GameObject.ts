import { DrawContext } from "ts/Common/DrawContext";
import { IActor } from "ts/gamelib/Actors/Actor";
import { IView } from "ts/gamelib/Views/View";

export interface IGameObject extends IActor, IView {
}

export interface IObject<TModel> extends IGameObject {
    actors: IActor[];
    views: IView[];
    model: ()=>TModel;
}

export class SingleGameObject<TModel> implements IGameObject, IObject<TModel> {
    constructor(public model: ()=> TModel, public actors: IActor[], public views: IView[]) {
    }

    update(timeModifier: number): void {
        this.actors.forEach(a => a.update(timeModifier));
    }

    display(drawContext: DrawContext): void {
        this.views.forEach(e => e.display(drawContext));
    }
}

// export class ComponentObjects<TComponent extends IGameObject> implements IGameObject {
//     constructor(public getComponents: ()=> TComponent[]) {
//     }

//     update(timeModifier: number): void {
//         var components: TComponent[] = this.getComponents();
//         components.forEach(a => a.update(timeModifier));
//     }

//     display(drawContext: DrawContext): void {
//         var components: TComponent[] = this.getComponents();
//         components.forEach(e => e.display(drawContext));
//     }
// }


// combi of single and component
export class MultiGameObject<TComponent extends IGameObject> implements IGameObject {
    constructor(public actors: IActor[], public views: IView[], public getComponents: ()=>TComponent[]) {
    }

    update(timeModifier: number): void {
        var components: TComponent[] = this.getComponents();
        components.forEach(a => a.update(timeModifier));
        this.actors.forEach(a => a.update(timeModifier));
    }

    display(drawContext: DrawContext): void {
        var components: TComponent[] = this.getComponents();
        components.forEach(e => e.display(drawContext));
        this.views.forEach(e => e.display(drawContext));
    }
}