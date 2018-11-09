import { DrawContext } from "src/ts/gamelib/1Common/DrawContext";
import { IActor } from "src/ts/gamelib/Actors/Actor";
import { IView } from "src/ts/gamelib/Views/View";
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