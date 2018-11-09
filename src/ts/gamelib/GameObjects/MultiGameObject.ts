import { DrawContext } from "../1Common/DrawContext";
import { IActor } from "src/ts/gamelib/Actors/Actor";
import { IView } from "src/ts/gamelib/Views/View";
import { IGameObject } from "./IGameObject";

// an actor that keeps the model array in sync with the components
// combi of single and component
export class MultiGameObject<TComponent extends IGameObject> implements IGameObject {
    constructor(public actors: IActor[], public views: IView[], public getComponents: () => TComponent[]) {
    }
    update(timeModifier: number): void {
        let components: TComponent[] = this.getComponents();
        components.forEach(a => a.update(timeModifier));
        this.actors.forEach(a => a.update(timeModifier));
    }
    display(drawContext: DrawContext): void {
        let components: TComponent[] = this.getComponents();
        components.forEach(e => e.display(drawContext));
        this.views.forEach(e => e.display(drawContext));
    }
}