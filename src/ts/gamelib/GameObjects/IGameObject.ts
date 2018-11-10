import { IActor } from "../../../../src/ts/gamelib/Actors/Actor";
import { IView } from "../../../../src/ts/gamelib/Views/View";

export interface IGameObject extends IActor, IView {
    actors: IActor[];
    views: IView[];
}



