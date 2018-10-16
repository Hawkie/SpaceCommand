import { DrawContext } from "ts/gamelib/1Common/DrawContext";
import { IActor } from "ts/gamelib/Actors/Actor";
import { IView } from "ts/gamelib/Views/View";
import { IGameObject } from "./IGameObject";


export class SingleGameObject implements IGameObject {
    constructor(public actors: IActor[], public views: IView[]) {
    }
    update(timeModifier: number): void {
        this.actors.forEach(a => a.update(timeModifier));
    }
    display(drawContext: DrawContext): void {
        this.views.forEach(e => e.display(drawContext));
    }
}